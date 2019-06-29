import React, { Fragment, useEffect } from 'react';
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

  if (!isVerified) {
    return <Redirect to="/verification" />;
  }

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>
      <PostForm />
      <div className="posts">
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
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
