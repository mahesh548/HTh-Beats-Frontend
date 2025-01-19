import { useParams } from "react-router";

export default function playlists() {
  const { id } = useParams();
  return <h1>Playlist id: {id}</h1>;
}
