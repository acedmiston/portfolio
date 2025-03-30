'use client';
import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { motion } from 'framer-motion';
import SectionHeading from './section-heading';
import { experiencesData } from '@/lib/data';
import { useSectionInView } from '@/lib/hooks';
import { Typography } from '@mui/material';
import { useLanguage } from '@/providers/language-provider';

const MotionTimelineItem = motion(TimelineItem);

export default function Experience() {
  const { ref } = useSectionInView('nav.experience');
  const { t } = useLanguage();

  return (
    <section id="experience" ref={ref} className="mb-28 scroll-mt-28 sm:mb-40">
      <SectionHeading>{t('experience.title')}</SectionHeading>
      <Timeline position="alternate-reverse">
        {experiencesData.map((item, index) => (
          <MotionTimelineItem
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot
                color="error"
                className="flex items-center justify-center dark:bg-red-500"
                sx={{ width: '46px', height: '46px' }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  {React.cloneElement(item.icon, {
                    style: { width: '24px', height: '24px' },
                  })}
                </div>
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="div">
                {t(item.companyKey)}
              </Typography>
              <Typography variant="subtitle2">{t(item.titleKey)}</Typography>
              <Typography variant="body2">{t(item.locationKey)}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {t(item.descriptionKey)}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                {t(item.dateKey)}
              </Typography>
            </TimelineContent>
          </MotionTimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
