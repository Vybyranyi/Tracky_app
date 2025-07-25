import React, { useRef } from 'react';
import ProjectsItem from '../ProjectsItem/ProjectsItem';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Empty } from 'antd';
import styles from './ProjectsSlider.module.scss';
import SmallTitle from '../../SmallTitle/SmallTitle';


function ProjectsSlider({ title, projects }) {
	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: false,
	};

	const sliderRef = useRef();
	return (
		<div className={styles.sliderWrapper}>
			<div className={styles.sliderDesc}>
				{<SmallTitle text={title} />}
				<div className={styles.sliderControls}>
					<button className={styles.prev} onClick={() => sliderRef?.current?.slickPrev()}>
						<i className="fa-solid fa-arrow-left"></i>
					</button>
					<button className={styles.next} onClick={() => sliderRef?.current?.slickNext()}>
						<i className="fa-solid fa-arrow-right"></i>
					</button>
				</div>
			</div>
			<div className={styles.projectsSlider}>
				{Array.isArray(projects) && projects.length > 0 ? (
					<Slider ref={sliderRef} {...settings}>
						{projects.map(item => <ProjectsItem obj={item} key={item._id || item.name} />)}
					</Slider>
				) : (
					<Empty />
				)}


			</div>
		</div>
	);
}

export default ProjectsSlider;