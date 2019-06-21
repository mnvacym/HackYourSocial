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

  const onChange = e => setSkill({ [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log(skillName);
    //
  };

  // get filtered profiles
  let filtered_profiles = [];
  profiles.map(profile => {
    if (profile.skills.includes(skillName)) {
      filtered_profiles.push(profile);
    }
  });
  return (
    <Fragment>
      <h4 className='large text-primary'>Find Profiles by Inputting Skill(s) or Location</h4>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Skill(s)'
            name='skillName'
            value={skillName}
            onChange={e => onChange(e)}
          />
        </div>
        <small className='form-text'>
          (FOR SKILLS) Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
        </small>
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
