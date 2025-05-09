import os
import re
import subprocess

from helpers import file_paths as fp
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def set_analysis_parameters(project, tool, with_student_tests, with_dev_tests = True):
    '''
    Sets the parameters for the mutant analysis

    :param project: The project to be analyzed
    :param tool: The tool to be used
    :param with_student_tests: If the student tests should be used
    :param with_dev_tests: If the developer tests should be used

    :return: runs the analyzer with the given parameters
    '''
    student_tests = ""
    dev_tests = ""
    if with_dev_tests:
        dev_tests = " --all-dev"
    if with_student_tests:
        student_tests = " -t " + fp.student_test_file_path

    run_analyzer(project, tool, student_tests, dev_tests)

def run_kill_matrix_analysis(project, tool):
    '''
    This will be running only one method against all mutants at once.
    This test method is present in tmp/PlaceholderTest.java

    :param project: The project to be analyzed
    :param tool: The tool to be used

    :return: runs the analyzer with the given parameters
    '''
    student_tests = " -t " + fp.placeholder_test_file_path
    no_dev_tests = ""

    run_analyzer(project, tool, dev_tests_arg=no_dev_tests, student_tests_arg = student_tests)

def run_analyzer(project, tool, student_tests_arg, dev_tests_arg):
    '''
    Generates mutants

    :param project: The project to be analyzed
    :param tool: The tool to be used
    :param student_tests_arg: if student tests should be used
    :param dev_tests_arg: if developer tests should be used
    
    :return: runs the analyzer with the given parameters, if project is Cli-32 output is saved in root/Cli-32f/tools_output/tool
    '''
    path = '/defects4j/analyzer/analyzer.py'
    cmd = ("python3 " + path + " run $HOME/" + project + "f" + dev_tests_arg + student_tests_arg + " --tools " + tool + " --stdout --stderr -v")
    #os.system(cmd)

    try:
        subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        logger.info(f"Error Mutant Run Analyzer: { e.output }")

def checkout_project(project_name, version):
    '''
    Checks out the project with the given version

    :param project_name: The name of the project
    :param version: The version of the project

    :return: the project is imported to root/project_name-versionf
    '''
    cmd = ("defects4j checkout -p " + project_name + " -v" + version + "f -w $HOME/"
                   + project_name + "-" + version + "f")
    os.system(cmd)

def compile_project(project):
    cmd = ("defects4j compile -w $HOME/" + project + "f")
    os.system(cmd)

def get_project_coverage(project):
    '''
    Gets the line and condition coverage of the project

    :param project: The project to get the coverage of
     
    :return: the live and condition coverage of the project
    '''
    cmd = ("defects4j coverage -w $HOME/" + project + "f")
    output = subprocess.check_output(cmd, shell=True, text=True)

    pattern = r'\d+(?:\.\d+)?'

    matches = re.findall(pattern, output)

    return matches

def set_test_suite_in_d4j_classpath(project):
    '''
    Sets the test suite in the defects4j classpath

    :param project: The project to set the test suite in

    :return: the test suite is set in the defects4j classpath
    '''
    student_tests = " -t " + fp.student_test_file_path
    path = '/defects4j/analyzer/analyzer.py'
    cmd = ("python3 " + path + " set_test_suite $HOME/" + project + "f" + student_tests + " --stdout --stderr -v")
    #os.system(cmd)

    try:
        subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        logger.info(f"Error Mutant Run Analyzer: { e.output }")



def get_reports_analyzer_path():
    return '/defects4j/analyzer/reportsanalyzer.py'