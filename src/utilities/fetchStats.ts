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
      mode: "cors"
    });

    const data = await result.json();

    let listeners = stats.listeners;

    if (
      data &&
      data.icestats &&
      data.icestats.source &&
      data.icestats.source.listeners
    ) {
      listeners = data.icestats.source.listeners;
    }

    return {
      stats: {
        ...stats,
        listeners,
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
