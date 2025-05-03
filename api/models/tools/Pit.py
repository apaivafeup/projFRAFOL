import ast
import glob
import re
import os
import subprocess

import pandas as pd
from models.Tool import Tool
from helpers import defects4j_helper as d4hj
from lxml import etree as ET
import logging
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PIT(Tool):

    def __init__(self):
        super().__init__("pit")

    def get_mutant_table_headers(self):
        return ["Mutant", "Line", "Operator", "Killed by:"]

    def run_analysis(self, project):
        path = d4hj.get_reports_analyzer_path()
        project_name, project_version = project.split("-")
        dir_path = "/root/" + project + "f/tools_output/pit/"
        filetype = "*.xml"
        filename = ""
        for file_path in os.listdir(dir_path):
            if file_path.endswith(filetype[1:]):
                filename = file_path
            cmd = ("python3 " + path + " table -p " + project_name + " -b "
                   + project_version + " -t " + self.name
                   + " $HOME/" + project + "f/tools_output/pit/" + filename
                   + " -o " + "$HOME/results.csv")
        os.system(cmd)

    def get_mutant_table_data(self, df, project):
        return self.parse_pit_dataframe(df, project)

    def get_mutation_summary(self, project):
        path = d4hj.get_reports_analyzer_path()
        filename = ""

        project_name, project_version = project.split("-")

        
        dir_path = dir_path = "/root/" + project + "f/tools_output/pit/"
        filetype = "*.xml"
        for file_path in os.listdir(dir_path):
            if file_path.endswith(filetype[1:]):
                filename = "/" + file_path

        cmd = ("python3 " + path + " summary -p " + project_name
                    + " -b " + project_version + " -t " + self.name + " $HOME/" + project + "f/tools_output/" + self.name + filename)
        
        try:
            output = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError as e:
            logger.info(f"Error: { e.output }")
            values = [0,0,0,0]
            return values
        
        pattern = r'([^:]+):\s+(.*)'
        matches = re.findall(pattern, output)
        return {key.strip(): value.strip() for key, value in matches}

    def get_kill_matrix(self, project):
        project_specific_path = "/root/" + project + "f/tools_output/pit"
        xml_files = glob.glob(project_specific_path + "/*.xml")
        if not xml_files:
            raise Exception("No XML files found in the specified path")

        mutants_killed = []

        for xml_file in xml_files:
            tree = ET.parse(xml_file)
            root = tree.getroot()

            for mutation in root.findall('mutation'):
                status = mutation.get('status')
                if status == 'KILLED':
                    killing_test = mutation.find('killingTest').text
                    if killing_test and 'StudentTest' in killing_test:
                        match = re.search(r'StudentTest\.(\w+)', killing_test)
                        if match:
                            killing_test_name = match.group(1)
                        else:
                            killing_test_name = "UnknownTest"      
                            
                        line_number = mutation.find('lineNumber').text

                        blocks_element = mutation.find("blocks")  # For PIT 1.9.0
                        if blocks_element is not None:
                            block_element = blocks_element.find("block")
                            if block_element is not None and block_element.text is not None:
                                block = int(block_element.text)
                            else:
                                raise ValueError("Missing or empty <block> tag in XML")
                        else:
                            raise ValueError("Missing <blocks> tag in XML")
                        
                        mutator = mutation.find('mutator').text

                        mutants_killed.append({
                            'killingTestName': killing_test_name,
                            'lineNumber': line_number,
                            'block': block,
                            'mutator': mutator
                        })

        csv_path = "/root/" + project + "-pit.csv"
        df = pd.read_csv(csv_path, header=0, names=["mutantId", "details"])

        final_dict = {}

        for mutant in mutants_killed:
            line_number = int(mutant['lineNumber'])
            block = int(mutant['block'])
            mutator = mutant['mutator']

            for index, row in df.iterrows():
                details = eval(row['details'])
                if details['line'] == line_number and details['block'] == block and details['mutator'] == mutator:
                    mutant_id = row['mutantId']
                    killed_by_test = mutant['killingTestName']
                    final_dict[mutant_id] = killed_by_test

        return final_dict
    
    def parse_pit_dataframe(self, df, project):
        mutant_list = df["Mutant"].tolist()[1:]  # Skip the first row

        line_list = list()
        operator_list = list()
        test_list = list()

        test_kill_map = self.get_kill_matrix(project)

        for _, row in df.iloc[1:].iterrows():
            details = ast.literal_eval(row['Details'])
            line_list.append(details.get('line'))
            mutator = details.get('mutator')
            if mutator:
                trimmed_mutator = mutator.replace('org.pitest.mutationtest.engine.gregor.mutators.', '')
            operator_list.append(trimmed_mutator)

            mutant_id = row['Mutant']
            killed_by_test = test_kill_map.get(mutant_id, "")
            test_list.append(killed_by_test)

        sheet_data = list()

        for item1, item2, item3, item4 in zip(mutant_list, line_list, operator_list, test_list):
            sheet_data.append((item1, item2, item3, item4))

        return sheet_data
    
    def get_mutants_killed_by_test(self, project):

        project_specific_path = "/root/" + project + "f/tools_output/pit"
        xml_files = glob.glob(project_specific_path + "/*.xml")
        if not xml_files:
            raise Exception("No XML files found in the specified path")

        mutants_killed = []

        for xml_file in xml_files:
            tree = ET.parse(xml_file)
            root = tree.getroot()

            for mutation in root.findall('mutation'):
                status = mutation.get('status')
                if status == 'KILLED':
                    line_number = mutation.find('lineNumber').text
                    block = mutation.find('block').text
                    mutator = mutation.find('mutator').text

                    mutants_killed.append({
                            'lineNumber': line_number,
                            'block': block,
                            'mutator': mutator
                        })

        csv_path = "/root/" + project + "-pit.csv"
        df = pd.read_csv(csv_path, header=0, names=["mutantId", "details"])

        killed_mutants_ids = []
        for mutant in mutants_killed:
            line_number = int(mutant['lineNumber'])
            block = int(mutant['block'])
            mutator = mutant['mutator']

            for index, row in df.iterrows():
                details = eval(row['details'])
                if details['line'] == line_number and details['block'] == block and details['mutator'] == mutator:
                    mutant_id = row['mutantId']
                    killed_mutants_ids.append(mutant_id)

        return killed_mutants_ids