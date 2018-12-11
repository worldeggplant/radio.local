import createStore from "react-waterfall";
import config from "./config/app.json";
import fetchMeta from "./utilities/fetchMeta";
import fetchStats from "./utilities/fetchStats";

export interface IGlobalState {
  config: {
    baseURL: string;
    streamURL: string;
    statsURL: string;
  };
  isPlaying: boolean;
  meta: {
    album?: string | null;
    artist?: string | null;
    cover?: string | null;
    loading: boolean;
    track?: string | null;
  };
  stats: {
    listeners?: number | null;
  };
}

export interface IGlobalActions {
  start: (state: IGlobalState, actions: IGlobalActions, ...props: any[]) => any;
  stop: (state: IGlobalState, actions: IGlobalActions, ...props: any[]) => any;
  fetchMeta: (
    state: IGlobalState,
    actions: IGlobalActions,
    ...props: any[]
  ) => any;
  fetchStats: (
    state: IGlobalState,
    actions: IGlobalActions,
    ...props: any[]
  ) => any;
}

const initialState: IGlobalState = {
  config,
  isPlaying: false,
  meta: {
    album: null,
    artist: null,
    cover: null,
    loading: false,
    track: null
  },
  stats: {
    listeners: null
  }
};

const actionsCreators: IGlobalActions = {
  fetchMeta,
  fetchStats,
  start: () => ({ isPlaying: true }),
  stop: () => ({ isPlaying: false })
};

const { actions, connect, Provider, subscribe } = createStore({
  actionsCreators,
  initialState
});

subscribe((action: any, result: any) => {
  if (result !== undefined) {
    console.info("STATE UPDATE:", action, result);
  }
});

export { actions, connect, Provider };
