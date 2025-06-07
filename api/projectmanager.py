import os
from helpers import file_helper as fh


def get_opened_projects():
    """
    Returns the list of projects that are currently opened in the application.

    :return: The list of projects that are currently opened in the application
    """
    project_folders = fh.get_root_folders()
    projects = []

    for project_folder in project_folders:
        project_name, version = project_folder.split("-")
        version = version[:-1]
        projects.append(f"{project_name}-{version}")

    return projects