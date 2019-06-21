import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/post';
import { connect } from 'react-redux';
import PostItem from './PostItem';

const SearchPosts = ({ getPosts, post: { posts } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const [userInput, setUserInput] = useState('');
  const [searchAll, setSearchAll] = useState('');

  const onChange = e => setUserInput(e.target.value);

  const { searchValue } = searchAll;

  const findPosts = e => {
    e.preventDefault();
    setSearchAll({ searchValue: userInput.toLowerCase() });
    setUserInput('');
  };

  let searchedPosts = posts.filter(post =>
    post.text
      .toString()
      .toLowerCase()
      .includes(searchValue)
  );

  return (
    <Fragment>
      <h4 className='large text-primary'>Search the posts</h4>
      <form className='form' onSubmit={e => findPosts(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Posts'
            name='userInput'
            value={userInput}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Find' />
      </form>
      <br />
      <hr />
      <hr />
      <br />
      <h1>Results</h1>
      <Fragment>
        <div className='posts'>
          {searchedPosts.length > 0 ? (
            searchedPosts.map(searchedPost => (
              <PostItem key={searchedPost._id} post={searchedPost} />
            ))
          ) : (
            <h4>No profiles found...</h4>
          )}
        </div>
      </Fragment>
    </Fragment>
  );
};

SearchPosts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
});

export default connect(
  mapStateToProps,
  { getPosts }
)(SearchPosts);
