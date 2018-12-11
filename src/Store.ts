import createStore from "react-waterfall";
import config from "./config/app.json";

const getAttributeFromTrack = (track: any, attribute: string) => {
  return track ? track.getAttribute(attribute) : null;
};

const parseMetaFromXML = (xml: string) => {
  const parser = new DOMParser();
  let rDom;
  try {
    rDom = parser.parseFromString(xml, "text/xml");
  } catch (err) {
    console.warn("ERROR", "Invalid XML response", err);
    return false;
  }

  const track = rDom.querySelector("track");

  return {
    album: getAttributeFromTrack(track, "album_name"),
    artist: getAttributeFromTrack(track, "artist_name"),
    cover: getAttributeFromTrack(track, "album_primary_image"),
    track: getAttributeFromTrack(track, "track_name")
  };
};

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
  fetchMeta: async (
    { config: { baseURL }, meta }: IGlobalState,
    globalActions: any,
    trigger = false
  ) => {
    if (!trigger) {
      await globalActions.fetchMeta(true);
    } else {
      return {
        meta: {
          ...meta,
          loading: true
        }
      };
    }

    try {
      const results = await fetch(`${baseURL}/metadata_output.txt`, {
        headers: {
          Accept: "text/plain"
        },
        method: "GET",
        mode: "no-cors"
      });

      const xml = await results.text();
      const newMeta = parseMetaFromXML(xml);

      return {
        meta: {
          ...meta,
          ...newMeta,
          loading: false
        }
      };
    } catch (error) {
      console.error(error);
    }

    return {
      meta: {
        ...meta,
        loading: false
      }
    };
  },
  fetchStats: async (
    { config: { statsURL }, stats }: IGlobalState,
    { fetchStats }: any,
    trigger = false
  ) => {
    if (!trigger) {
      await fetchStats(true);
    } else {
      return {
        stats: {
          ...stats,
          loading: true
        }
      };
    }

    try {
      const result = await fetch(statsURL, {
        mode: "no-cors"
      });

      const xmlData = await result.text();

      const parser = new DOMParser();
      const rDom = parser.parseFromString(xmlData, "text/xml");
      const listenersEl = rDom.querySelector("listeners");

      return {
        stats: {
          ...stats,
          listeners: listenersEl
            ? parseInt(listenersEl.innerHTML, 10)
            : stats.listeners,
          loading: false
        }
      };
    } catch (e) {
      console.error(e);
    }

    return {
      stats: {
        ...stats,
        loading: false
      }
    };
  },
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
