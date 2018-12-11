import { IGlobalState } from "../Store";

const fetchStats = async (
  { config: { statsURL }, stats }: IGlobalState,
  actions: any,
  trigger = false
) => {
  if (!trigger) {
    await actions.fetchStats(true);
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
};

export default fetchStats;
