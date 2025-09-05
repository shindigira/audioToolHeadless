import { AudioHeadless } from '@/audio';
import { metaDataCreator } from '@/helpers/common';
import { listen } from '@/helpers/notifier';
import type { AudioState } from '@/types';

export const updateMetaData = (data: any) => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata(metaDataCreator(data));
  }
};

export const attachMediaSessionHandlers = () => {
  const audio = new AudioHeadless();
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
      const audioInstance = AudioHeadless.getAudioInstance();
      audioInstance.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      const audioInstance = AudioHeadless.getAudioInstance();
      audioInstance.pause();
    });

    // Only add next and previous handler if there is a valid queue
    if (audio.getQueue().length) {
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        audio.playPrevious();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        audio.playNext();
      });
    }
  }
};

export const updatePositionState = () => {
  listen('AUDIO_X_STATE', (audioState: AudioState) => {
    if (audioState?.duration && audioState?.playbackRate && audioState?.progress) {
      navigator.mediaSession.setPositionState({
        duration: audioState.duration,
        playbackRate: audioState.playbackRate,
        position: audioState.progress,
      });
    }
  });
};
