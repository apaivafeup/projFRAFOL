import os
import pandas as pd

def store_project_specific_path_csv(project, tool):
    """
    Grabs results.csv and saves it to a project-specific CSV file in the root directory.

    :return: if project is Cli-32, and tool is pit, the content of the file results.csv will be saved to Cli-32-pit.csv
    """ 
    path = "/root/results.csv"

    if os.path.exists(path):
        df = pd.read_csv(path)
        project_specific_path = "/root/" + project + "-" + tool + ".csv"
        if not os.path.exists(project_specific_path):
            df.to_csv(project_specific_path, index=False)
            print(f"Saved results to {project_specific_path}")
        else:
            print(f"Project-specific CSV file {project_specific_path} already exists")


def load_csv_from_root(project):
    """
    Loads csv with the given path in the root directory.

    :param project: the name of the project/path to load the csv file from

    :return: a pandas DataFrame containing the data from the csv file
    """ 
    path = "/root/" + project + ".csv"

    df = pd.read_csv(path, header=None, names=["Mutant", "Details"])

    return df