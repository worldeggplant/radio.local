import { IGlobalState } from "../Store";

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

const fetchMeta = async (
  { config: { baseURL }, meta }: IGlobalState,
  actions: any,
  trigger = false
) => {
  if (!trigger) {
    await actions.fetchMeta(true);
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
};

export default fetchMeta;
