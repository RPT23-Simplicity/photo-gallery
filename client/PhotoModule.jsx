/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Gallery from './components/Gallery.jsx';
import Carousel from './components/Carousel.jsx';

const placeholderData = [
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-001.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-002.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-003.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-004.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-005.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-006.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-007.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-008.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-009.jpg',
];

class PhotoModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      showCarousel: window.innerWidth < 1024 === true,
    };
  }

  componentDidMount() {
    const ids = window.location.pathname.split('/');
    const productId = ids[2];
    const styleId = `00${ids[3]}`;
    this.fetchPhotosByStyle(productId, styleId);
    window.addEventListener('resize', this.handleResize);

    // test function to test changing the url
    // setInterval(() => {
    //   const productId = Math.ceil(Math.random() * 100);
    //   const styleId = Math.ceil(Math.random() * 3);
    //   this.props.history.push(`/shop/${productId}/${styleId}`);
    // }, 3000);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      console.log('url changed:', location);
      const ids = location.pathname.split('/');
      const productId = ids[2];
      const styleId = `00${ids[3]}`;
      this.fetchPhotosByStyle(productId, styleId);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const showCarousel = window.innerWidth < 1024 === true;
    this.setState({
      showCarousel,
    });
  };

  fetchPhotosByStyle = async (productId, styleId) => {
    try {
      const response = await fetch(`/photos/${productId}/${styleId}`);
      if (!response.ok) {
        throw new Error('photo fetch request failed');
      }
      const data = await response.json();
      this.setState({
        photos: data,
      });
    } catch (e) {
      this.setState({
        photos: placeholderData,
      });
    }
  }

  render() {
    const { showCarousel, photos } = this.state;
    return (
      <>
        {showCarousel
          ? <Carousel photos={photos} />
          : <Gallery photos={photos} />}
      </>
    );
  }
}

PhotoModule.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object,
  }).isRequired,
};

export default withRouter(PhotoModule);
