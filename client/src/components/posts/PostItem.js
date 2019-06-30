import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon } from 'react-share';
import { addLike, addUnLike, deletePost } from '../../actions/post';

const PostItem = ({
  addLike,
  addUnLike,
  deletePost,
  auth,
  post: { _id, title, text, name, avatar, user, likes, unlikes, comments, date },
  showActions,
}) => (
  <div className='post bg-white p-1 my-1'>
    <div>
      <Link to={`/profile/${user}`}>
        <img className='round-img' src={avatar} alt='' />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <h2 className='my-1'>{title}</h2>
      <p className='my-1'>{text}</p>
      <p className='post-date'>
        Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
      </p>

      {showActions && (
        <Fragment>
          <button onClick={() => addLike(_id)} type='button' className='btn btn-light'>
            <i className='fas fa-thumbs-up' />{' '}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button onClick={() => addUnLike(_id)} type='button' className='btn btn-light'>
            <i className='fas fa-thumbs-down' />{' '}
            <span>{unlikes.length > 0 && <span>{unlikes.length}</span>}</span>
          </button>
          <Link to={`/posts/${_id}`} className='btn btn-primary'>
            Discussion{' '}
            {comments.length > 0 && <span className='comment-count'>{comments.length}</span>}
          </Link>{' '}
          {!auth.loading && user === auth.user._id && (
            <button onClick={() => deletePost(_id)} type='button' className='btn btn-danger'>
              <i className='fas fa-times' />
            </button>
          )}
          <div>
            <h4 className='shr-btn shr-text'>Share on: </h4>
            <TwitterShareButton
              url={`http://localhost:3000/posts/${_id}`}
              title={title}
              className='shr-btn twitter'
            >
              <TwitterIcon size={40} round={false} />
            </TwitterShareButton>
            <LinkedinShareButton
              url={`http://localhost:3000/posts/${_id}`}
              className='shr-btn linkedin'
            >
              <LinkedinIcon size={40} round={false} />
            </LinkedinShareButton>
          </div>
        </Fragment>
      )}
    </div>
  </div>
);

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  addUnLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { addLike, addUnLike, deletePost }
)(PostItem);
