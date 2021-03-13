/* global document */
import nanoid from "nanoid";
import { Required } from "Object/_api";
import * as particles from "pixi-particles";
import * as PIXI from "pixi.js";
import colors from "~colors";
import { PLAYER_ID, PRIORITY_LASER, PRIORITY_MARKER } from "~constants";
import { arePositionsEqual, getRelativePosition } from "~lib/geometry";
import { rangeTo } from "~lib/math";
import { Display, Entity, Pos } from "~types";

const BASE_SPEED = 1;

export interface RendererConfig {
  gridWidth: number;
  gridHeight: number;
  tileWidth: number;
  tileHeight: number;
  backgroundColor: string;
  hex?: boolean;
  hexBaseWidth?: number;
}

interface RenderEntity {
  displayComp: Display;
  pos: Pos;
  sprite: PIXI.Sprite;
  background?: PIXI.Graphics;
}

export default class Renderer {
  private gridWidth: number;

  private gridHeight: number;

  private tileHeight: number;

  private tileWidth: number;

  private appWidth: number;

  private appHeight: number;

  private renderEntities: Record<string, RenderEntity> = {};

  private emitters: Record<string, particles.Emitter> = {};

  private loadPromise: null | Promise<unknown> = null;

  private app: PIXI.Application;

  private zoomedIn: boolean = false;

  private layers: Record<number, PIXI.Container> = {};

  private movementPaths: Map<string, Pos[]> = new Map();

  private hex: boolean = false;

  private hexBaseWidth: number = 0;

  private center: Pos = { x: 0, y: 0 };

  public constructor({
    gridWidth,
    gridHeight,
    tileWidth,
    tileHeight,
    backgroundColor,
    hex,
    hexBaseWidth,
  }: RendererConfig) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.hex = Boolean(hex);
    this.hexBaseWidth = hexBaseWidth || tileWidth / 2;
    this.appWidth = document.body.clientWidth - 256;
    this.appHeight = document.body.clientHeight - 250 - 25;
    this.app = new PIXI.Application({
      width: this.appWidth,
      height: this.appHeight,
      backgroundColor: hexToNumber(backgroundColor),
      antialias: false,
    });
  }

  public load(assets: Record<string, string>) {
    this.loadPromise = new Promise((resolve) =>
      PIXI.Loader.shared
        .add(
          Object.entries(assets).map(([name, file]) => ({
            name,
            url: file.startsWith("/") ? `.${file}` : file,
          })),
        )
        .load(resolve),
    );
    return this.loadPromise;
  }

  public setDimensions(width: number, height: number): void {
    // odd numbered width is causing little red dots
    const adjustedWidth = width % 2 ? width - 1 : width;
    // height doesn't appear to have any effect
    const adjustedHeight = height;

    if (adjustedWidth !== this.appWidth || adjustedHeight !== this.appHeight) {
      this.appWidth = adjustedWidth;
      this.appHeight = adjustedHeight;
      this.app.view.width = adjustedWidth;
      this.app.view.height = adjustedHeight;
      this.app.renderer.resize(adjustedWidth, adjustedHeight);
      this.app.renderer.clear();
      this.recenter();
    }
  }

  public setCenter(pos: Pos): void {
    this.center = pos;
    this.recenter();
  }

  private recenter(): void {
    if (this.isZoomedIn()) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  public zoomIn(): void {
    this.zoomedIn = true;
    this.app.stage.scale = new PIXI.Point(2, 2);
    const appPos = this.calcAppPos(this.center);
    this.app.stage.position = new PIXI.Point(
      -appPos.x * 2 + this.appWidth / 2,
      -appPos.y * 2 + this.appHeight / 2,
    );
  }

  public zoomOut(): void {
    this.zoomedIn = false;
    this.app.stage.scale = new PIXI.Point(1, 1);
    const appPos = this.calcAppPos(this.center);
    this.app.stage.position = new PIXI.Point(
      -appPos.x + this.appWidth / 2,
      -appPos.y + this.appHeight / 2,
    );
  }

  public isZoomedIn() {
    return this.zoomedIn;
  }

  public toggleZoom() {
    if (this.isZoomedIn()) {
      this.zoomOut();
    } else {
      this.zoomIn();
    }
  }

  public clear(): void {
    for (const id of Object.keys(this.renderEntities)) {
      this.removeEntity(id);
    }
    for (const [key, emitter] of Object.entries(this.emitters)) {
      emitter.destroy();
      delete this.emitters[key];
    }
  }

  public addEntity(entity: Required<Entity, "pos" | "display">): void {
    const { pos, display } = entity;
    const sprite = this.createSprite(pos, display);

    if (entity.id === PLAYER_ID) {
      this.setCenter(entity.pos);
    }

    this.renderEntities[entity.id] = {
      displayComp: { ...display },
      pos: { ...pos },
      sprite,
    };

    if (display.hasBackground) {
      const background = new PIXI.Graphics();
      background.beginFill(this.app.renderer.backgroundColor);
      background.lineStyle(0);
      background.drawRect(0, 0, this.tileWidth, this.tileHeight);
      background.endFill();
      background.position = new PIXI.Point(
        pos.x * this.tileWidth,
        pos.y * this.tileHeight,
      );

      this.renderEntities[entity.id].background = background;
      this.getLayer(display.priority).addChild(background);
    }
    this.getLayer(display.priority).addChild(sprite);
  }

  updateEntity(entity: Required<Entity, "display" | "pos">): void {
    const renderEntity = this.renderEntities[entity.id];
    if (renderEntity) {
      if (!arePositionsEqual(renderEntity.pos, entity.pos)) {
        renderEntity.pos = entity.pos;
        if (renderEntity.displayComp.discreteMovement) {
          this.setSpritePosition(
            renderEntity.sprite,
            renderEntity.pos,
            renderEntity.displayComp,
          );
        } else if (this.movementPaths.has(entity.id)) {
          (this.movementPaths.get(entity.id) || []).push(entity.pos);
        } else {
          this.movementPaths.set(entity.id, [entity.pos]);
        }

        if (renderEntity.background) {
          renderEntity.background.position.set(
            entity.pos.x * this.tileWidth,
            entity.pos.y * this.tileHeight,
          );
        }
        if (entity.id === PLAYER_ID) {
          this.setCenter(entity.pos);
        }
      }

      if (renderEntity.displayComp.hidden !== entity.display.hidden) {
        renderEntity.displayComp = {
          ...renderEntity.displayComp,
          hidden: entity.display.hidden,
        };
        renderEntity.sprite.visible = !entity.display.hidden;
      }

      if (
        renderEntity.displayComp.tile !== entity.display.tile ||
        renderEntity.displayComp.color !== entity.display.color ||
        renderEntity.displayComp.priority !== entity.display.priority ||
        renderEntity.displayComp.rotation !== entity.display.rotation ||
        renderEntity.displayComp.flipX !== entity.display.flipX ||
        renderEntity.displayComp.flipY !== entity.display.flipY ||
        renderEntity.displayComp.hasBackground !== entity.display.hasBackground
      ) {
        this.reAddEntity(entity);
      }
    }
  }

  public removeEntity(entityId: string): void {
    const renderEntity = this.renderEntities[entityId];
    if (renderEntity) {
      delete this.renderEntities[entityId];
      if (renderEntity.background) {
        renderEntity.background.parent.removeChild(renderEntity.background);
      }
      if (renderEntity.sprite) {
        renderEntity.sprite.parent.removeChild(renderEntity.sprite);
      }
      if (this.movementPaths.has(entityId)) {
        this.movementPaths.delete(entityId);
      }
    }
  }

  private reAddEntity(entity: Required<Entity, "pos" | "display">): void {
    const renderEntity = this.renderEntities[entity.id];
    const isPlaying =
      renderEntity && renderEntity.sprite instanceof PIXI.AnimatedSprite
        ? renderEntity.sprite.playing
        : false;
    this.removeEntity(entity.id);
    this.addEntity(entity);
    if (renderEntity && renderEntity.sprite instanceof PIXI.AnimatedSprite) {
      if (isPlaying) {
        this.playAnimation(entity.id);
      } else {
        this.stopAnimation(entity.id);
      }
    }
  }

  public playAnimation(entityId: string): void {
    const renderEntity = this.renderEntities[entityId];
    if (
      renderEntity &&
      renderEntity.sprite &&
      renderEntity.sprite instanceof PIXI.AnimatedSprite
    ) {
      renderEntity.sprite.play();
    }
  }

  public stopAnimation(entityId: string): void {
    const renderEntity = this.renderEntities[entityId];
    if (
      renderEntity &&
      renderEntity.sprite &&
      renderEntity.sprite instanceof PIXI.AnimatedSprite
    ) {
      renderEntity.sprite.stop();
    }
  }

  public configureSpriteSheet(
    spriteSheet: string,
    data: { id: string; x: number; y: number }[],
  ) {
    data.forEach(({ id, x, y }) => {
      const frame = new PIXI.Rectangle(
        x * this.tileWidth,
        y * this.tileHeight,
        this.tileWidth,
        this.tileHeight,
      );
      const texture = new PIXI.Texture(
        PIXI.utils.TextureCache[spriteSheet],
        frame,
      );
      PIXI.Texture.addToCache(texture, id);
    });
  }

  private createSprite(pos: Pos, display: Display) {
    let sprite: PIXI.Sprite | PIXI.AnimatedSprite;
    if (typeof display.tile === "string") {
      sprite = new PIXI.Sprite(
        PIXI.utils.TextureCache[display.tile || "unknown"],
      );
    } else {
      sprite = new PIXI.AnimatedSprite(
        display.tile.map((tile) => PIXI.utils.TextureCache[tile || "unknown"]),
      );
      (sprite as PIXI.AnimatedSprite).animationSpeed = display.speed || 0.2;
      (sprite as PIXI.AnimatedSprite).play();
    }
    const scale = display.scale || 1;
    sprite.pivot.set(this.tileWidth / 2 / scale, this.tileHeight / 2 / scale);
    sprite.scale = new PIXI.Point(
      scale * (display.flipX ? -1 : 1),
      scale * (display.flipY ? -1 : 1),
    );
    sprite.angle = display.rotation || 0;
    this.setSpritePosition(sprite, pos, display);
    sprite.width = this.tileWidth;
    sprite.height = this.tileHeight;
    sprite.tint = parseInt((display.color || "#FFFFFF").substr(1), 16);
    sprite.visible = !display.hidden;

    return sprite;
  }

  private setSpritePosition(sprite: PIXI.Sprite, pos: Pos, display: Display) {
    const { x, y } = this.calcAppPos(pos);
    sprite.position.set(x, y);
  }

  private calcAppPos(pos: Pos): Pos {
    const { x, y } = pos;
    if (this.hex) {
      return {
        x: (x * (this.tileWidth + this.hexBaseWidth)) / 2 + this.tileWidth / 2,
        y:
          y * this.tileHeight +
          (x % 2 === 0 ? this.tileHeight / 2 : this.tileHeight),
      };
    } else {
      return {
        x: x * this.tileWidth + this.tileWidth / 2,
        y: y * this.tileHeight + this.tileHeight / 2,
      };
    }
  }

  private getLayer(priority: number) {
    if (this.layers[priority]) {
      return this.layers[priority];
    }
    const layer = new PIXI.Container();
    layer.name = priority.toString();
    this.layers[priority] = layer;
    this.app.stage.addChild(layer);
    this.app.stage.children.sort((a, b) => {
      const aPriority = parseFloat(a.name || "0") || 0;
      const bPriority = parseFloat(b.name || "0") || 0;
      return aPriority - bPriority;
    });
    return layer;
  }

  public setBackgroundColor(color: string) {
    this.app.renderer.backgroundColor = hexToNumber(color);
    Object.entries(this.renderEntities)
      .filter(([id, entity]) => entity.background)
      .forEach(([id, entity]) =>
        this.reAddEntity({
          id,
          display: entity.displayComp,
          pos: entity.pos,
          template: "NONE",
        }),
      );
  }

  public addSmoke(pos: Pos, offset: Pos): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
      if (this.emitters[key]) {
        this.emitters[key].spawnChance = 1;
        return;
      }
      const texture = PIXI.Texture.WHITE;
      const emitter = new particles.Emitter(this.app.stage, [texture], {
        alpha: {
          start: 0.5,
          end: 0.0,
        },
        scale: {
          start: 1 / 8,
          end: 3 / 4,
          minimumScaleMultiplier: 1,
        },
        color: {
          start: colors.darkGray,
          end: colors.darkGray,
        },
        speed: {
          start: 5,
          end: 3,
          minimumSpeedMultiplier: 1,
        },
        acceleration: {
          x: 1,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 270,
          max: 300,
        },
        noRotation: true,
        rotationSpeed: {
          min: 0,
          max: 0,
        },
        lifetime: {
          min: 3,
          max: 6,
        },
        blendMode: "normal",
        frequency: 0.25,
        emitterLifetime: -1,
        maxParticles: 1000,
        particlesPerWave: 3,
        pos: {
          x: pos.x * this.tileWidth + offset.x,
          y: pos.y * this.tileHeight + offset.y,
        },
        addAtBack: false,
        spawnType: "point",
      });
      this.emitters[key] = emitter;
    });
  }

  public stopSmoke(pos: Pos, offset: Pos): void {
    const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
    const emitter = this.emitters[key];
    if (emitter) {
      emitter.spawnChance = 0;
    }
  }

  public removeSmoke(pos: Pos, offset: Pos): void {
    const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
    const emitter = this.emitters[key];
    if (emitter) {
      emitter.destroy();
    }
    delete this.emitters[key];
  }

  public explode(pos: Pos): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      const texture = PIXI.Texture.WHITE;
      const config: particles.EmitterConfig = {
        alpha: {
          list: [
            { value: 1, time: 0 },
            { value: 0.5, time: 1 },
          ],
        },
        scale: {
          list: [
            { value: 1 / 2, time: 0 },
            { value: 1 / 2, time: 1 },
          ],
        },
        color: {
          list: [
            { value: colors.yellow, time: 0 },
            { value: colors.red, time: 0.5 },
            { value: colors.darkGray, time: 1 },
          ],
        },
        speed: {
          list: [
            { value: 100, time: 0 },
            { value: 50, time: 1 },
          ],
        },
        acceleration: {
          x: 0,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 0,
          max: 360,
        },
        noRotation: true,
        lifetime: {
          min: 0.1,
          max: 0.3,
        },
        frequency: 0.02,
        emitterLifetime: 0.1,
        maxParticles: 1000,
        particlesPerWave: 10,
        pos: {
          x: pos.x * this.tileWidth + this.tileWidth / 2,
          y: pos.y * this.tileHeight + this.tileHeight / 2,
        },
        addAtBack: false,
        spawnType: "point",
      };
      new particles.Emitter(
        this.app.stage,
        [texture],
        config,
      ).playOnceAndDestroy();
    });
  }

  public start(): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      this.app.ticker.add((delta: number) =>
        Object.values(this.emitters).forEach((emitter) =>
          emitter.update(delta / 60),
        ),
      );
      this.app.ticker.add((delta: number) => this.handleMovement(delta));
    });
  }

  public bump(entityId: string, towardsPos: Pos): void {
    let path = this.movementPaths.get(entityId);
    if (!path) {
      path = [];
      this.movementPaths.set(entityId, path);
    }
    const renderEntity = this.renderEntities[entityId];
    if (!renderEntity) return;
    const { pos } = renderEntity;
    path.push(
      { x: (pos.x + towardsPos.x) / 2, y: (pos.y + towardsPos.y) / 2 },
      pos,
    );
  }

  public projectile(from: Pos, to: Pos, color?: string, speed: number = 1) {
    const id = nanoid();
    this.addEntity({
      id,
      template: "NONE",
      display: {
        tile: "projectile",
        priority: PRIORITY_LASER,
        color,
      },
      pos: from,
    });
    setTimeout(() => {
      const path: Pos[] = rangeTo(speed).map(() => to);
      this.movementPaths.set(id, path);
      setTimeout(() => this.removeEntity(id), 250);
    }, 50);
  }

  public flashStatusEffect(entityId: string, tile: string) {
    // set timeout to give entities time to move
    setTimeout(() => {
      const renderEntity = this.renderEntities[entityId];
      if (renderEntity && renderEntity.sprite.visible) {
        const id = nanoid();
        this.addEntity({
          template: "NONE",
          id,
          pos: renderEntity.pos,
          display: {
            tile,
            scale: 0.5,
            priority: PRIORITY_MARKER,
          },
        });
        this.movementPaths.set(id, [
          getRelativePosition(renderEntity.pos, ["N"]),
        ]);
        setTimeout(() => this.removeEntity(id), 500);
      }
    }, 50);
  }

  private handleMovement(delta: number) {
    for (const [entityId, path] of this.movementPaths.entries()) {
      const entity = this.renderEntities[entityId];
      if (!entity || !path.length) {
        this.movementPaths.delete(entityId);
      } else {
        const speed = BASE_SPEED * path.length;
        const oldX = entity.sprite.x;
        const oldY = entity.sprite.y;
        const { x: destX, y: destY } = this.calcAppPos(path[0]);
        const deltaX = destX - oldX;
        const deltaY = destY - oldY;
        const xSpeedModifier =
          deltaY === 0 ? 1 : Math.abs(deltaX) / Math.abs(deltaY);
        let newX = oldX;
        let newY = oldY;
        if (Math.abs(deltaX) <= speed * delta) {
          newX = destX;
        } else if (deltaX > 0) {
          newX = oldX + speed * delta * xSpeedModifier;
        } else {
          newX = oldX - speed * delta * xSpeedModifier;
        }
        if (Math.abs(deltaY) <= speed * delta) {
          newY = destY;
        } else if (deltaY > 0) {
          newY = oldY + speed * delta;
        } else {
          newY = oldY - speed * delta;
        }

        if (newY === destY && newX === destX) {
          path.shift();
        }

        entity.sprite.position.set(newX, newY);
      }
    }
  }

  public getClientRectFromPos(gamePos: Pos): ClientRect {
    const canvas = this.app.view;
    const canvasParent = canvas.parentElement;
    if (!canvasParent) throw new Error("App canvas is not in document");
    const scaleX = (this.gridWidth * this.tileWidth) / canvasParent.clientWidth;
    const scaleY =
      (this.gridHeight * this.tileHeight) / canvasParent.clientHeight;
    if (!this.zoomedIn) {
      const width = this.tileWidth / scaleX;
      const height = this.tileHeight / scaleY;
      const left =
        canvasParent.getBoundingClientRect().left +
        (gamePos.x * this.tileWidth) / scaleX;
      const right = left + width;
      const top =
        canvasParent.getBoundingClientRect().top +
        (gamePos.y * this.tileHeight) / scaleY;
      const bottom = top + height;
      return { width, height, left, right, top, bottom };
    } else {
      const stageX = this.app.stage.position.x / this.tileWidth / -2;
      const stageY = this.app.stage.position.y / this.tileHeight / -2;
      const width = (this.tileWidth * 2) / scaleX;
      const height = (this.tileHeight * 2) / scaleY;
      const left =
        canvasParent.getBoundingClientRect().left +
        ((gamePos.x - stageX) * this.tileWidth * 2) / scaleX;
      const right = left + width;
      const top =
        canvasParent.getBoundingClientRect().top +
        ((gamePos.y - stageY) * this.tileHeight * 2) / scaleY;
      const bottom = top + height;
      return { width, height, left, right, top, bottom };
    }
  }

  getPosFromMouse(mouseX: number, mouseY: number): Pos {
    const canvas = this.app.view;
    const canvasParent = canvas.parentElement;
    if (!canvasParent) throw new Error("App canvas is not in document");
    const scaleX = (this.gridWidth * this.tileWidth) / canvasParent.clientWidth;
    const scaleY =
      (this.gridHeight * this.tileHeight) / canvasParent.clientHeight;
    const scaledMouseX = mouseX * scaleX;
    const scaledMouseY = mouseY * scaleY;
    if (!this.zoomedIn) {
      return {
        x: Math.floor(scaledMouseX / this.tileWidth),
        y: Math.floor(scaledMouseY / this.tileHeight),
      };
    } else {
      const offsetX = Math.floor(scaledMouseX / this.tileWidth / 2);
      const offsetY = Math.floor(scaledMouseY / this.tileHeight / 2);
      const stageX = this.app.stage.position.x / this.tileWidth / -2;
      const stageY = this.app.stage.position.y / this.tileHeight / -2;
      return {
        x: stageX + offsetX,
        y: stageY + offsetY,
      };
    }
  }

  public getLoadPromise() {
    return this.loadPromise || Promise.reject();
  }

  public appendView(el: HTMLElement) {
    el.appendChild(this.app.view);
  }
}

function hexToNumber(hex: string): number {
  return parseInt(hex.startsWith("#") ? hex.substr(1) : hex, 16);
}
