// src/data/releases.ts
export const releases = [
    {
      id: '1',
      title: 'Release 1',
      artist: 'Artist 1',
      coverArt: '', // Placeholder
      releaseDate: 'January 15, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, urna eu tempor facilisis, nisl lectus ultrices nunc.',
      previewAudio: '/audio/preview1.mp3',
      tracks: [
        {
          id: '1-1',
          title: 'Track 1',
          duration: '3:45',
          audioUrl: '/audio/track1-1.mp3'
        },
        {
          id: '1-2',
          title: 'Track 2',
          duration: '4:12',
          audioUrl: '/audio/track1-2.mp3'
        }
      ]
    },
    {
      id: '2',
      title: 'Release 2',
      artist: 'Artist 1',
      coverArt: '', // Placeholder
      releaseDate: 'May 22, 2023',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      previewAudio: '/audio/preview2.mp3',
      tracks: [
        {
          id: '2-1',
          title: 'Track 1',
          duration: '5:30',
          audioUrl: '/audio/track2-1.mp3'
        },
        {
          id: '2-2',
          title: 'Track 2',
          duration: '3:25',
          audioUrl: '/audio/track2-2.mp3'
        }
      ]
    },
    {
      id: '3',
      title: 'Release 3',
      artist: 'Artist 2',
      coverArt: '', // Placeholder
      releaseDate: 'October 10, 2023',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      previewAudio: '/audio/preview3.mp3',
      tracks: [
        {
          id: '3-1',
          title: 'Track 1',
          duration: '3:15',
          audioUrl: '/audio/track3-1.mp3'
        }
      ]
    }
  ];