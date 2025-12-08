'use client';
import * as React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  timelineItemClasses,
} from '@mui/lab';
import { motion } from 'framer-motion';
import SectionHeading from './section-heading';
import { experiencesData } from '@/lib/data';
import { useSectionInView } from '@/lib/hooks';
import { Typography, useMediaQuery } from '@mui/material';
import { useLanguage } from '@/providers/language-provider';

const MotionTimelineItem = motion.create(TimelineItem);

export default function Experience() {
  const { ref } = useSectionInView('nav.experience');
  const { t } = useLanguage();

  const isMobile = useMediaQuery('(max-width:700px)');

  return (
    <section id="experience" ref={ref} className="mb-28 scroll-mt-28 sm:mb-40">
      <SectionHeading>{t('experience.title')}</SectionHeading>

      <Timeline
        position={isMobile ? 'right' : 'alternate'}
        sx={{
          ...(isMobile && {
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }),
        }}
      >
        {experiencesData.map((item, index) => (
          <MotionTimelineItem
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <TimelineSeparator>
              <TimelineDot
                color="error"
                className="flex items-center justify-center dark:bg-red-500"
                sx={{ width: '46px', height: '46px' }}
              >
                {React.cloneElement(
                  item.icon as React.ReactElement<
                    React.SVGProps<SVGSVGElement>
                  >,
                  { style: { width: '24px', height: '24px' } }
                )}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6">{t(item.companyKey)}</Typography>
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
