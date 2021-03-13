import { Howl } from "howler";
// @ts-ignore
import audio from "../../assets/audio/*.webm"; // eslint-disable-line import/no-unresolved

export default class Audio {
  private sounds: Record<string, Howl> = {};

  private currentMusic: null | [Howl, number] = null;

  load() {
    Object.entries(audio as Record<string, string>).forEach(([file, url]) => {
      this.sounds[removeFileExtension(file)] = new Howl({
        src: [url.startsWith("/") ? `.${url}` : url],
      });
    });
  }

  play(name: string) {
    const sound = this.sounds[name];
    if (!sound) {
      console.error("Unknown sound: ", name);
      return;
    }
    if (!sound.playing() || sound.seek() > 0.25) {
      sound.play();
    }
  }

  loop(name: string) {
    this.sounds[name].loop(true);
    if (!this.sounds[name].playing()) {
      this.play(name);
    }
  }

  stop(name: string) {
    this.sounds[name].stop();
  }

  playMusic(song: string) {
    if (this.currentMusic) {
      const [sound, id] = this.currentMusic;
      sound.fade(1, 0, 1000, id);
      sound.off(undefined, undefined, id);
      sound.on(
        "fade",
        () => {
          if (this.currentMusic) {
            sound.stop();
            this.currentMusic = null;
          }
          this.playMusic(song);
        },
        id,
      );
    } else {
      const sound = this.sounds[song];

      const loopData: Record<string, number> = {
        "song-city": 4.564,
        "song-lair": 89.744,
        "song-palace": 60.438,
      };
      const loopTo = loopData[song] || 0;

      const id = sound.play();
      sound.volume(1, id);
      this.currentMusic = [sound, id];

      sound.on(
        "end",
        () => {
          sound.seek(loopTo, id);
          sound.play(id);
        },
        id,
      );
    }
  }
}

function removeFileExtension(file: string) {
  const dotIndex = file.indexOf(".");
  if (dotIndex === -1) return file;
  return file.substring(0, dotIndex);
}
