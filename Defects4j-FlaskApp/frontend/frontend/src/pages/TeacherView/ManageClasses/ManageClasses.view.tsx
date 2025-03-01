import React, { useState } from 'react'
import { CoverageCard } from '../../../components/CoverageCard'
import SelectSearch from '../../../components/SelectSearch'
import ListView from '../../../components/List/List.view'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

function ManageClasses() {
    const [className, setClassName] = useState('')
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const classes = [
        {name: 'Class 1', value: 'class1'},
        {name: 'Class 2', value: 'class2'},
        {name: 'Class 3', value: 'class3'},
    ]

    const listItems = Array.from({length: 12}, () => {
        return { title: 'up202309812', onSuccess: () => {}, onDecline: () => {}, logo:<FontAwesomeIcon icon={faUser} width={24} height={24}/> }
    })

  return (
    <div className='flex flex-col'>
        <div className="flex flex-row gap-2 items-center text-black">
        <label className="text-xl font-semibold" htmlFor="">
                Class:
        </label>
        <SelectSearch selection={className} handleSelection={setClassName} options={classes} placeholder='Select Class name'></SelectSearch>

      </div>
        <div className='grid grid-cols-6 gap-4 w-full mt-4'>
        <CoverageCard
            title="Students"
            coverage={20}
        />
                <CoverageCard
            title="Submissions"
            coverage={16}
        />
                <CoverageCard
            title="Pending Requests"
            coverage={3}
        />
        
        </div>

        <div className='flex flex-col'>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          How do I create an account?
        </AccordionSummary>
        <AccordionDetails>
          Click the "Sign Up" button in the top right corner and follow the registration process.
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          aria-controls="panel2-content"
          id="panel2-header"
        >
          I forgot my password. What should I do?
        </AccordionSummary>
        <AccordionDetails>
          Click on "Forgot Password" on the login page and follow the instructions sent to your email.
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          aria-controls="panel3-content"
          id="panel3-header"
        >
          How do I update my profile information?
        </AccordionSummary>
        <AccordionDetails>
          Go to "My Account" settings and select "Edit Profile" to make changes.
        </AccordionDetails>
        <AccordionActions>
          {/* Add any actions here if needed */}
        </AccordionActions>
      </Accordion>
    </div>

    </div>
  )
}

export default ManageClasses