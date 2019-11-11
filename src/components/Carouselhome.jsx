import React,{Component} from "react";
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    Row,
    Col
  } from 'reactstrap';

const items = [
{
    src: require("./sale-banner-1.jpg"),
    altText: '',
    caption: ''
},
{
    src: require("./sale-banner-2.jpg"),
    altText: '',
    caption: ''
},
{
    src: require("./sale-banner-3.jpg"),
    altText: '',
    caption: ''
}
];

class Carouselhome extends Component {

    constructor(props) {
        super(props);
        this.state = { activeIndex: 0 };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }
    
    onExiting() {
    this.animating = true;
    }

    onExited() {
    this.animating = false;
    }

    next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
    }

    previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
    }

    render () {
        const { activeIndex } = this.state;
        const slides = items.map((item) => {
        return (
                <CarouselItem onExiting={this.onExiting} onExited={this.onExited} key={item.src}>
                    <div style={{height:"250px"}} id="curtain2" className="text-center">
                        <img src={item.src} alt={item.altText}/>  
                    </div>
                    <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
                </CarouselItem>
        );
        });
        return (
            <Row style={{backgroundColor:"#ffc61a"}}>
                <Col >
                    <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
                        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                            {slides}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                    </Carousel>
                </Col>
            </Row>
        )
    }
}

export default Carouselhome