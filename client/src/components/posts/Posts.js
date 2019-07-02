import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../actions/post';

const Posts = ({ getPosts, post: { posts, loading }, isVerified }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const [userInput, setUserInput] = useState('');
  const [searchAll, setSearchAll] = useState('');
  const [checkSearch, setCheckSearch] = useState(false);

  if (!isVerified) {
    return <Redirect to='/verification' />;
  }

  const onChange = e => setUserInput(e.target.value);

  const { searchValue } = searchAll;

  const findPosts = e => {
    e.preventDefault();
    setSearchAll({ searchValue: userInput.toLowerCase() });
    setUserInput('');
    setCheckSearch(true);
  };

  let searchedPosts = posts.filter(
    post =>
      post.text
        .toString()
        .toLowerCase()
        .includes(searchValue) ||
      post.title
        .toString()
        .toLowerCase()
        .includes(searchValue)
  );

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome to the community
      </p>

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

      <PostForm />

      <div className='posts'>
        {!checkSearch ? (
          posts.map(post => <PostItem key={post._id} post={post} />)
        ) : searchedPosts.length > 0 ? (
          searchedPosts.map(searchedPost => <PostItem key={searchedPost._id} post={searchedPost} />)
        ) : (
          <h4>No posts found...</h4>
        )}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  isVerified: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
  isVerified: state.auth.isVerified,
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Posts);
