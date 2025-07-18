import React from "react";
import TodaysTask from "../../Components/TodaysTask/TodaysTask";
import ProjectSummary from "../../Components/ProjectSummary/ProjectSummary";
import styles from "./Overview.module.scss";
import StatistickBlock from "../../Components/StatistickBlock/StatistickBlock";
import HelmetComponent from "../../Components/Helmet/HelmetComponent";
import { useTranslation } from "react-i18next";

export default function Overview() {
    const { t } = useTranslation();

    return (
        <div className={styles.OverviewWrapper}>
            <HelmetComponent title={t('helmetTitle.overview')} />
            <div className={styles.OverviewLeft}>
                <TodaysTask />
                <ProjectSummary />
            </div>
            <div className={styles.OverviewRight}>
                <StatistickBlock type="total_tasks" />
                {/* <StatistickBlock type="total_tasks" /> */}
                {/* <StatistickBlock type="total_tasks" /> */}
            </div>
        </div>
    )
}