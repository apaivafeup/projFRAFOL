import { createStudent } from '@services/Firebase'
import SignupFormView from './SignupForm.view'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@context/auth'
import { useSnackbar } from '@context/snackbar'
import { useTeacher } from '@context/teacher'

interface SignupFormProps {
    setIsLoginSelected: (isLoginSelected: boolean) => void
}

function SignupForm( { setIsLoginSelected }: SignupFormProps ) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [classSelection, setClassSelection] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { createUser } = useAuth()
    const { showSnackbar } = useSnackbar()
    const { allClasses } = useTeacher()
    const navigate = useNavigate()

      const handleSignUp = useCallback(
        async (event: { preventDefault: () => void }) => {
          event.preventDefault();
          if (!username || !classSelection || !email || !password) {
            showSnackbar("Please input all correct data", "error");
            return;
          }
          if(password.length < 8){
            showSnackbar("Password must be at least 8 characters long", "error");
            return;
          }
          try {
            setIsLoading(true);
            await createUser(email, password, username, classSelection);
            await createStudent(username, classSelection);
            navigate("/student/submission");
          } catch (error: unknown) {
            showSnackbar((error as Error).message, "error");
          } finally {
            setIsLoading(false);
          }
        },
        [username, classSelection, email, password, showSnackbar, createUser, navigate],
      );

        const allClassesSelection = useMemo(() => {
          return allClasses.map((className) => {
            return { name: className, value: className };
          });
        }, [allClasses]);
  return (
    <SignupFormView 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
        classSelection={classSelection}
        setClassSelection={setClassSelection}
        handleSubmit={handleSignUp}
        isLoading={isLoading}
        onAlreadyHaveAccountClick={() => setIsLoginSelected(true)}
        options={allClassesSelection}
    />
  )
}

export default SignupForm