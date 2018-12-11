import React from "react";
import { actions, connect, IGlobalState } from "../Store";
import "./Player.css";

interface IPlayerProps {
  isPlaying: boolean;
}

const toggle = (isPlaying: boolean) => () =>
  isPlaying ? actions.stop() : actions.start();

export const Player = ({ isPlaying }: IPlayerProps) => (
  <div className={`Player ${isPlaying ? "Player-playing" : "Player-stopped"}`}>
    <div className="Player-record-container">
      <div className="Player-record">
        <div className="Player-record-logo" />
        <div className="Player-record-image" />
      </div>

      <div className="Player-arm" />
      <div className="Player-button">
        <button onClick={toggle(isPlaying)}>start &bull; stop</button>
      </div>
    </div>
  </div>
);

const mapStateToProps = ({ isPlaying }: IGlobalState) => ({ isPlaying });

export default connect(mapStateToProps)(Player);
