import time
import requests
import pathlib
import pandas as pd
import logging

logging.basicConfig(format='%(asctime)s - %(levelname)s:%(message)s',
                    level=logging.INFO, datefmt='%m/%d/%Y %H:%M:%S')


def download_song(file_path, song_url, retry=0, max_retry=5):
    """ Download bird song from song_url and store it as mp3 file in file_path
    :param file_path: str, path used to store the downloaded song
    :param song_url: str, url used to get the song
    :param retry: int, current number of retry for the song_url
    :param max_retry: int, maximum number of retry
    :return: None
    """
    r = requests.get(song_url)
    logging.info(("GET finished with code {} after {} retry"
                 .format(r.status_code, retry)))
    if r.status_code != 200:
        if max_retry < retry or r.status_code == 404:
            return
        time.sleep(200)
        return download_song(file_path, song_url, retry + 1)
    with open(file_path, 'wb') as f:
        f.write(r.content)


def generate_file_path(bird_id, target_dir='../dataset/sound/'):
    """ Generate file path used to save the retrieved mp3 file
    :param bird_id: int, GBif ID of the bird
    :param target_dir: str, directory used to store the mp3 files
    :return: str, file path as a string
    """
    path_dir = pathlib.Path(target_dir)
    filename = "{}.mp3".format(bird_id)
    return str(path_dir / filename)


def get_song(row):
    """ Extract information needed to get the bird song corresponding to a
    dataset entry
    :param row: entry of the dataset
    :return: None
    """
    xc_id = row['occurrenceID'].split("XC")[1]
    song_url = "https://www.xeno-canto.org/{}/download".format(xc_id)
    file_path = generate_file_path(row['gbifID'])
    logging.info("Downloading {} to {}".format(song_url, file_path))
    download_song(file_path, song_url)


def get_all_songs():
    """
    Get all bird songs recorded in european countries.
    :return: None
    """
    df1 = pd.read_csv('../dataset/xeno_canto_bird_songs.tsv', sep='\t',
                     usecols=['gbifID', 'occurrenceID', 'countryCode'])
    df2 = pd.read_csv('../dataset/european_country.tsv', sep='\t')
    df = pd.merge(df1, df2, how='inner', on=['countryCode'])
    for index, row in df.iterrows():
        get_song(row)
        # Sleep to avoid overloading xeno-canto server
        time.sleep(2)


if __name__ == "__main__":
    get_all_songs()
