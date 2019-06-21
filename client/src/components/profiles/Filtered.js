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

  const [skill, setSkill] = useState('');
  const { skillName } = skill;

  const [location, setLocation] = useState('');
  const { locationName } = location;

  // identify which button is clicked to apply the filtering as per it.
  const [activated, setActivated] = useState(true);
  const { skillActivated, locationActivated } = activated;

  // dynamic select a fuction to set the state as per the state name clicked.
  let settingState;
  if (skillActivated) {
    settingState = setSkill;
  } else {
    settingState = setLocation;
  }

  const onChange = e => settingState({ [e.target.name]: e.target.value.toUpperCase() });

  const onSubmit = async e => {
    e.preventDefault();
  };

  let filtered_profiles = [];
  {
    skillActivated
      ? // filter profiles by skills
        profiles.map(profile => {
          if (profile.skills.includes(skillName)) {
            filtered_profiles.push(profile);
          }
        })
      : // filter profiles by location
        profiles.map(profile => {
          if (profile.location === locationName) {
            filtered_profiles.push(profile);
          }
        });
  }

  const skillOnClick = () => {
    console.log('clicked...');
    setActivated({ skillActivated: true, locationActivated: false });
  };

  const locationOnClick = () => {
    console.log('clicked...');
    setActivated({ skillActivated: false, locationActivated: true });
  };

  return (
    <Fragment>
      <h4 className='large text-primary'>Find Profiles by Inputting Skill(s) or Location</h4>
      <h2>Filter By :</h2>
      <input type='submit' className='btn btn-primary' value='Skill(s)' onClick={skillOnClick} />
      <input type='submit' className='btn btn-primary' value='Location' onClick={locationOnClick} />

      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder={skillActivated ? 'skill(s)' : 'location'}
            name={skillActivated ? 'skillName' : 'locationName'}
            value={skillActivated ? skillName : locationName}
            onChange={e => onChange(e)}
          />
        </div>
        {skillActivated && (
          <small className='form-text'>
            (FOR SKILLS) Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        )}

        <input type='submit' className='btn btn-primary' value='Find' />
      </form>
      <br />
      <hr />
      <hr />
      <br />
      <h1>Results</h1>
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
