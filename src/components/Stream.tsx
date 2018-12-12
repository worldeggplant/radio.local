import React from "react";
import { actions, connect, IGlobalState } from "../Store";

export interface IStreamProps {
  isPlaying: boolean;
  streamURL: string;
}

export class Stream extends React.Component<IStreamProps> {
  stream: any = null;

  constructor(props: IStreamProps) {
    super(props);

    this.stream = React.createRef();
  }

  componentDidMount() {
    if (this.stream.current) {
      this.stream.current.addEventListener("pause", this.stop);
    }
  }

  componentWillUnmount() {
    if (this.stream.current) {
      this.stream.current.removeEventListener("pause", this.stop);
    }
  }

  componentWillReceiveProps(prevProps: IStreamProps) {
    const { isPlaying } = this.props;
    if (prevProps.isPlaying !== isPlaying) {
      if (isPlaying) {
        this.stop();
      } else {
        this.start();
      }
    }
  }

  start = () => {
    if (this.stream.current) {
      this.stream.current.play();
    }
  };

  stop = () => {
    const { isPlaying } = this.props;
    if (this.stream.current) {
      this.stream.current.pause();
    }

    if (isPlaying) {
      actions.stop();
    }
  };

  render() {
    const { isPlaying, streamURL } = this.props;

    return (
      <audio
        autoPlay={isPlaying}
        controls={false}
        ref={this.stream}
        style={{ display: "none" }}
      >
        <source src={streamURL} type="audio/mp3" />
      </audio>
    );
  }
}

const mapStateToProps = ({
  config: { streamURL },
  isPlaying
}: IGlobalState) => ({
  isPlaying,
  streamURL
});

export default connect(mapStateToProps)(Stream);
