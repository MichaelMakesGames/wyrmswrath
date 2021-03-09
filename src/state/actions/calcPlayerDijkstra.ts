import PriorityQueue from "priorityqueuejs";
import { createStandardAction } from "typesafe-actions";
import { getAdjacentPositions, getPosKey } from "~lib/geometry";
import { registerHandler } from "~state/handleAction";
import { Pos } from "~types";
import WrappedState from "~types/WrappedState";

const calcPlayerDijkstra = createStandardAction("calcPlayerDijkstra")();
export default calcPlayerDijkstra;

function calcPlayerDijkstraHandler(
  state: WrappedState,
  action: ReturnType<typeof calcPlayerDijkstra>,
): void {
  const playerSegments = state.select
    .entitiesWithComps("pos", "wyrm")
    .filter((e) => e.wyrm.isPlayer);
  state.setRaw({
    ...state.raw,
    playerDijkstra: dijkstra({
      sources: playerSegments.map((e) => e.pos),
      maxDistance: 10,
      getCost: (pos) =>
        state.select.isPositionBlocked(
          pos,
          state.select.entitiesWithComps("monster"),
        )
          ? Infinity
          : 1,
    }),
  });
}

registerHandler(calcPlayerDijkstraHandler, calcPlayerDijkstra);

function dijkstra({
  sources,
  maxDistance,
  getCost = () => 1,
}: {
  sources: Pos[];
  maxDistance: number;
  getCost: (pos: Pos) => number | null | undefined;
}) {
  const dist: Record<string, number> = {};
  const prev: Record<string, Pos> = {};
  const q = new PriorityQueue<Pos>(
    (a, b) => dist[getPosKey(b)] - dist[getPosKey(a)],
  );
  for (const pos of sources) {
    dist[getPosKey(pos)] = 0;
    q.enq(pos);
  }

  while (!q.isEmpty()) {
    const current = q.deq();
    for (const adjacent of getAdjacentPositions(current)) {
      const cost = getCost(adjacent);
      if (cost != null && Number.isFinite(cost)) {
        const newDist = dist[getPosKey(current)] + cost;
        if (
          newDist <= maxDistance &&
          (!dist[getPosKey(adjacent)] || newDist < dist[getPosKey(adjacent)])
        ) {
          dist[getPosKey(adjacent)] = newDist;
          prev[getPosKey(adjacent)] = current;
          q.enq(adjacent);
        }
      }
    }
  }

  return { dist, prev };
}
