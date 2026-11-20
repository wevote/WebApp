const youTubeIdRegX = /(?:^|[^\w.-])(?:https?:\/\/)?(?:(?:www|m|music)\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#\s]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})(?![\w-])/gi;

const vimeoIdRegX = /(?:^|[^\w.-])(?:https?:\/\/)?(?:(?:www|player)\.)?vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/|(?:album|showcase)\/\d+\/video\/|manage\/videos\/)?(\d+)(?:\/([\da-f]+))?(?:\?(?:[^#\s]*&)?h=([\da-f]+))?(?![\w-])/gi;

export default function getVideoIds (text) {
  if (!text) {
    return [];
  }
  const youtubeList = [...text.matchAll(youTubeIdRegX)].map((m) => ({ type: 'youtube', id: m[1], index: m.index }));
  const vimeoList = [...text.matchAll(vimeoIdRegX)].map((m) => ({ type: 'vimeo', id: m[1], index: m.index }));

  const videoSet = new Set();

  const videoList = [...youtubeList, ...vimeoList].sort((a, b) =>  a.index - b.index).filter(({ type, id }) => {
    if (!videoSet.has(`${type}${id}`)) {
      videoSet.add(`${type}${id}`);
      return true;
    } else {
      return false;
    }
  });

  return videoList;
}
