from lxml import etree as ET

def get_line_coverage_color_highlighting(project):
    """
    Get the color highlighting of the project's coverage.
    The coverage is read from the coverage.xml file in the root directory.

    :param project: the name of the project to get the coverage data for

    :return: a dictionary containing the red, yellow, and green lines of the project's coverage
    """
    coverage_file_path = ("/root/" + project + "f/coverage.xml")
    tree = ET.parse(coverage_file_path)
    root = tree.getroot()

    red_lines = []    # Not covered
    yellow_lines = [] # Partially covered (branch coverage)
    green_lines = []  # Fully covered

    for line in root.findall(".//line"):
        number = int(line.get("number"))
        hits = int(line.get("hits", 0))
        branch = line.get("branch", "false")
        condition_coverage = line.get("condition-coverage")

        if hits == 0:
            red_lines.append(number)
        elif branch == "true" and condition_coverage:
            percent = int(condition_coverage.split("%")[0])
            if percent < 100:
                yellow_lines.append(number)
            else:
                green_lines.append(number)
        else:
            green_lines.append(number)

    return {
        "red": sorted(red_lines),
        "yellow": sorted(yellow_lines),
        "green": sorted(green_lines),
    }
