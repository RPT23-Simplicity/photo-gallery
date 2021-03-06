import React from 'react';
import Gallery from './Gallery.jsx';

const photos = [
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-001.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/98-002.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/31-001.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-003.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/72-003.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/30-003.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/66-002.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/85-001.jpg',
  'https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/57-002.jpg',
];

const gallery = mount(<Gallery />);

beforeEach(() => {
  // clear component state and set props
  gallery.unmount();
  gallery.mount();
  gallery.setProps({
    photos,
  });
});

describe('Component rendering', () => {
  it('should render photos in gallery view', () => {
    const galleryCards = gallery.find('.gallery');
    console.log(galleryCards.children().debug());
    expect(galleryCards.children()).toHaveLength(9);
  });

  it('should render a photo card with img url', () => {
    const image = gallery.find('.card img').first();
    console.log(image.props());
    expect(image.prop('src')).toEqual('https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-001.jpg');
    expect(image.prop('data-index')).toEqual(0);
  });
});

describe('Gallery Modal', () => {
  it('should render photos into photo modal', () => {
    const modal = gallery.find('#gallery-modal');
    expect(modal.children()).toHaveLength(10);
  });

  it('should render a photo card with img url', () => {
    const modal = gallery.find('#gallery-modal');
    const image = modal.find('.card img').at(0);
    expect(image.prop('src')).toEqual('https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/1-001.jpg');
    expect(image.prop('data-index')).toEqual(0);
  });

  it('should open the photo modal on clicking on a gallery card and scroll to right height', () => {
    const galleryCard = gallery.find('.gallery .card').first();
    galleryCard.simulate('click', { target: { dataset: { index: 5 } } });
    expect(gallery.find('#gallery-modal')).toHaveClassName('active');
    expect(gallery.state('modalScroll')).toEqual(6440);
  });

  it('should close the photo modal when close btn is clicked', () => {
    gallery.setState({
      modalActive: true,
    });
    expect(gallery.find('#gallery-modal')).toHaveClassName('active');
    const closeBtn = gallery.find('.closeBtn');
    closeBtn.simulate('click');
    expect(gallery.find('#gallery-modal')).not.toHaveClassName('active');
  });
});
