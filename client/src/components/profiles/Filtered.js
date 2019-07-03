/* eslint-disable array-callback-return */
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
  const { skillName = '' } = skill;

  // location
  const [location, setLocation] = useState('');
  const { locationName = '' } = location;

  // value: to save the value input from the search bar
  const [value, setValue] = useState('');
  const { inputValue, inputValue2 } = value;

  // identify which button is clicked to apply the filtering as per it.
  const [activated, setActivated] = useState(false);
  const { skillActivated, locationActivated, bothActivated } = activated;

  // === VARIABLES ===
  let settingState,
    filtered_profiles = [];

  // === METHODS ===
  // dynamic select a fuction to setState as per the filtering button clicked. (single filter)
  if (!bothActivated) {
    skillActivated ? (settingState = setSkill) : (settingState = setLocation);
  }

  // onChange : works only for single filter not for both
  const onChange = e => settingState({ [e.target.name]: e.target.value });

  // click filter button
  const onSubmit = async e => {
    e.preventDefault();
    // save the input value before clearing the field
    if (!bothActivated) {
      skillActivated
        ? setValue({ inputValue: skillName.toUpperCase() })
        : setValue({ inputValue: locationName.toUpperCase() });
    } else {
      setValue({ inputValue: skillName.toUpperCase(), inputValue2: locationName.toUpperCase() });
    }
    // clear the input field
    setSkill({ skillName: '' });
    setLocation({ locationName: '' });
  };

  // filter profiles by:
  (function filterByActivatedBtn() {
    // skills
    if (skillActivated) {
      profiles.map(profile => {
        if (profile.skills.length > 0) {
          profile.skills.map(skill => skill.toUpperCase()).includes(inputValue) &&
            filtered_profiles.push(profile);
        }
      });
      // location
    } else if (locationActivated) {
      profiles.map(profile => {
        if (profile.location) {
          profile.location.toUpperCase() === inputValue && filtered_profiles.push(profile);
        }
      });
      // both skills & location
    } else if (bothActivated) {
      profiles.map(profile => {
        if (profile.location && profile.skills.length > 0) {
          profile.location.toUpperCase() === inputValue2 &&
            profile.skills.map(skill => skill.toUpperCase()).includes(inputValue) &&
            filtered_profiles.push(profile);
        }
      });
    }
  })();

  // click on skill
  const skillOnClick = () => {
    setActivated({ skillActivated: true, locationActivated: false, bothActivated: false });
  };

  // click on location
  const locationOnClick = () => {
    setActivated({ locationActivated: true, skillActivated: false, bothActivated: false });
  };

  // click on both skill & location
  const bothOnClick = () => {
    setActivated({ bothActivated: true, skillActivated: false, locationActivated: false });
  };

  // to display input field for single filter
  const singleFilter = () => (
    <input
      type='text'
      placeholder={skillActivated ? 'skill' : 'location'}
      name={skillActivated ? 'skillName' : 'locationName'}
      value={(skillActivated ? skillName : locationName) || ''}
      onChange={e => onChange(e)}
    />
  );

  // to display input field for dual filter
  const dualFilter = () => (
    <div>
      <input
        type='text'
        placeholder={'skill'}
        name={'skillName'}
        value={skillName || ''}
        onChange={e => setSkill({ [e.target.name]: e.target.value })}
        required
      />
      <br />
      <input
        type='text'
        placeholder={'location'}
        name={'locationName'}
        value={locationName || ''}
        onChange={e => setLocation({ [e.target.name]: e.target.value })}
        required
      />
    </div>
  );

  return (
    <Fragment>
      <h4 className='large text-primary'>Filter Profiles by Skill or by Location</h4>
      <div>
        <h2>Filter By</h2>
        {/* Skill button */}
        <input type='submit' className='btn btn-primary' value='Skill' onClick={skillOnClick} />
        {/* locatoin button */}
        <input
          type='submit'
          className='btn btn-primary'
          value='Location'
          onClick={locationOnClick}
        />
        {/* skill & location button */}
        <input
          type='submit'
          className='btn btn-primary'
          value='Skill & Location'
          onClick={bothOnClick}
        />
      </div>

      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>{!bothActivated ? singleFilter() : dualFilter()}</div>
        {/* // later to be improved
        {skillActivated && ( 
          <small className='form-text'>
            (FOR SKILLS) Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        )} */}

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
