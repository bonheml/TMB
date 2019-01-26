from pathlib import Path

dataset_path = Path(__file__).resolve().parent.parent / 'dataset'
img_path = dataset_path / 'captions_by_species'
df_path = dataset_path / 'flikr_bird_images.tsv'

def download_image_urls():
    topics = [f.name for f in img_path.iterdir() if f.is_dir()]
    scrapper = FlickrPhotoScrapper()
    scrapper.scrap_images(topics, df_path)

def download_images():
    scrapper = FlickrPhotoScrapper()
    scrapper.download_images(df_path, img_path, resize=(299,299))

if __name__ == "__main__":
    from data_scrapper import FlickrPhotoScrapper
    download_image_urls()
    download_images()
