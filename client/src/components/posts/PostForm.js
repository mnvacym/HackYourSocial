import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form
        className='form my-2'
        onSubmit={e => {
          e.preventDefault();
          addPost({ title, text });
          setText('');
          setTitle('');
        }}
      >
        <textarea
          name='title'
          cols='30'
          rows='1'
          placeholder='Add a title'
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='text-capitalize my-1'
          required
        />
        <textarea
          className='mt-1'
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(
  null,
  { addPost }
)(PostForm);
