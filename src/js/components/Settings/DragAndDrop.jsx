import React, { Component } from 'react';
import styled from 'styled-components';

class DragAndDrop extends Component {
  constructor (props) {
    super(props);
    this.state = {
      drag: false,
    };
  }

  dropRef = React.createRef()

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true });
    }
  }

  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({ drag: false });
    }
  }

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log(e.dataTransfer.files);
      this.props.handleDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  }

  componentDidMount () {
    const div = this.dropRef.current;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount () {
    const div = this.dropRef.current;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
  }

  render () {
    return (
      <Wrapper
        ref={this.dropRef}
        active={this.state.drag}
      >
        Drag image here
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  background: ${(props) => (props.active ? '#e8e8e8' : '#f7f7f7')};
  color: #666;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-size: 24px;
  text-align: center;
  transition: .1s;
  border: ${(props) => (props.active ? '2px dashed #cccccc' : '2px dashed #e8e8e8')};
  border-radius: ${(props) => (props.active ? '8px' : '8px')};
`;

export default DragAndDrop;
