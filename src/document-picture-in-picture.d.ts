interface DocumentPictureInPictureOptions {
  height?: number;
  width?: number;
}

interface DocumentPictureInPicture {
  requestWindow(options?: DocumentPictureInPictureOptions): Promise<Window>;
}

interface Window {
  documentPictureInPicture?: DocumentPictureInPicture;
}
