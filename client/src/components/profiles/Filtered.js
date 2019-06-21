import React, { Fragment, useState, useEffect } from 'react';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';

const Filtered = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  // === useState ===
  // skill
  const [skill, setSkill] = useState('');
  const { skillName } = skill;

  // location
  const [location, setLocation] = useState('');
  const { locationName } = location;

  // value state: to save the value input from the search bar
  const [value, setValue] = useState('');
  const { inputValue } = value;

  // identify which button is clicked to apply the filtering as per it.
  const [activated, setActivated] = useState(false);
  const { skillActivated } = activated;

  // === VARIABLES ===
  let settingState,
    filtered_profiles = [];

  // === METHODS ===
  // dynamic select a fuction to set the state as per the state name clicked.
  skillActivated ? (settingState = setSkill) : (settingState = setLocation);

  // onChange
  const onChange = e => settingState({ [e.target.name]: e.target.value.toUpperCase() });

  // click filter button
  const onSubmit = async e => {
    e.preventDefault();
    // save the input value before clearing the field
    skillActivated ? setValue({ inputValue: skillName }) : setValue({ inputValue: locationName });
    // clear the input field
    setSkill({ skillName: '' });
    setLocation({ locationName: '' });
  };

  // filter profiles by:
  skillActivated
    ? // skills
      profiles.map(profile => {
        if (profile.skills.includes(inputValue)) {
          filtered_profiles.push(profile);
        }
      })
    : // location
      profiles.map(profile => {
        if (profile.location === inputValue) {
          filtered_profiles.push(profile);
        }
      });

  // click on skill
  const skillOnClick = () => {
    console.log('clicked...');
    setActivated({ skillActivated: true, locationActivated: false });
  };

  // click on location
  const locationOnClick = () => {
    console.log('clicked...');
    setActivated({ skillActivated: false, locationActivated: true });
  };

  return (
    <Fragment>
      <h4 className='large text-primary'>Filter Profiles by Skill or by Location</h4>
      <div>
        <h2>Filter By</h2>
        <input type='submit' className='btn btn-primary' value='Skill' onClick={skillOnClick} />
        <input
          type='submit'
          className='btn btn-primary'
          value='Location'
          onClick={locationOnClick}
        />
      </div>

      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder={skillActivated ? 'skill(s)' : 'location'}
            name={skillActivated ? 'skillName' : 'locationName'}
            value={(skillActivated ? skillName : locationName) || ''}
            onChange={e => onChange(e)}
          />
        </div>
        {skillActivated && ( // later improvement
          <small className='form-text'>
            (FOR SKILLS) Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        )}

        <input type='submit' className='btn btn-primary' value='Filter' />
      </form>

      <br />
      <h1>Filtering Results</h1>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='profiles'>
            {filtered_profiles.length > 0 ? (
              filtered_profiles.map(profile => <ProfileItem key={profile._id} profile={profile} />)
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
      <br />
      <hr />
      <hr />
      <br />
    </Fragment>
  );
};

Filtered.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Filtered);
