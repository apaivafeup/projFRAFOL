import React, { useCallback, useState } from "react";
import ScreenHero from "../../components/ScreenHero/ScreenHero.view";
import { faFileContract , faUser} from "@fortawesome/free-solid-svg-icons";
import { ButtonLoader } from "../../components/ButtonLoader";
import { UserAuth } from "../../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectSearch, { SelectedOptionValue } from 'react-select-search';
//import 'react-select-search/style.css'
import './SelectSearchLight.css'



function StudentView() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [classSelection, setClassSelection] = React.useState("");

  const { signIn } = UserAuth();

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      setError("");
      try {
        setIsLoading(true);
        await signIn(username, password);
        setIsLoading(false);
      } catch (error: unknown) {
        setIsLoading(false);
        setError(error.message);
      }
    },
    [username, password, signIn],
  );

  const handleClassSelection = (selectedValue: SelectedOptionValue | SelectedOptionValue[]) => {
    if (Array.isArray(selectedValue)) {
      setClassSelection(selectedValue[0].toString());
    } else {
      setClassSelection(selectedValue.toString());
    }
  }
  const options = [
    {name: 'Swedish', value: 'sv'},
    {name: 'English', value: 'en'},
];


  return (
    <div className="flex flex-col items-center w-full justify-center h-screen">
      <ScreenHero
        icon={faFileContract}
        title="Hello Student"
        description="Please input your student number and select your class to submit your tests and view your results. Be aware that your teacher has to accept your login so input your correct data."
      />
      <form onSubmit={handleLogin} className="gap-2">
        <div className="flex flex-row items-center gap-2">
          <FontAwesomeIcon icon={faUser} width={16} height={16}></FontAwesomeIcon>
          <input
            type="text"
            placeholder="Student Number"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="border-1 border-gray-200 p-2 rounded-lg"
          />
        </div>
      </form>
      <div className="flex mt-2 flex-col items-center gap-2 justify-center">
         <SelectSearch value={classSelection} search onChange={handleClassSelection}  options={options}  name="l" placeholder="Select your class" />
        </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? <ButtonLoader /> : "Submit"}
      </button>
    </div>
  );
}

export default StudentView;
