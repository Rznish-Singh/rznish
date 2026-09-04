import Markdown from "react-markdown"

import {
  TimescaleAge,
  TimescaleContent,
  TimescaleHeader,
  TimescaleIntroScroll,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/components/timescale"

export default function Timesline() {
  return (
    <TimescaleIntroScroll>
      <TimescaleRoot className="mt-4">
        <TimescaleHeader>
          <TimescaleAge>Age</TimescaleAge>
          <TimescaleYear>Years</TimescaleYear>
        </TimescaleHeader>

        <TimescaleViewport>
          <TimescaleTrack>
            <TimescaleRail />

            {MILESTONES.map((milestone) => (
              <TimescaleItem key={milestone.year}>
                <TimescaleTick />

                <TimescaleAge>{milestone.year - BIRTH_YEAR}</TimescaleAge>
                <TimescaleYear>{milestone.year}</TimescaleYear>

                {milestone.content && (
                  <TimescaleContent className="typeset typeset-timescale">
                   <Markdown
  components={{
    a: ({ node, ...props }) => (
      <a
        {...props}
        className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
  }}
>
  {milestone.content}
</Markdown>
                  </TimescaleContent>
                )}
              </TimescaleItem>
            ))}
          </TimescaleTrack>
        </TimescaleViewport>
      </TimescaleRoot>
    </TimescaleIntroScroll>
  )
}

const BIRTH_YEAR = 2005

type Milestone = {
  year: number
  content?: string
}

const MILESTONES: Milestone[] = [
  
  { 
    year: 2005,
    content: "Born in  Bharat.",
   
  },
  {
    year: 2006,
  },
  { year: 2007 },
  { year: 2008 },
  { year: 2009 },
  { year: 2010 },
  {
    year: 2011,
  },
  { year: 2012 },
  { year: 2013 },
  {
    year: 2014,
  },
  {
    year: 2016,
   
  },
  {
    year: 2017,
  },
 
  {
    year: 2019,
  },
  {
    year: 2020,
    content: "completed primary school",
  },
  { year: 2021 },
  {
    year: 2022,
    content: `completed secondary school .
      started my journey in engineering in computer science and engineering at [Gehu](https://gehu.ac.in)`,
     
  },
  { year: 2023 },
  {
    year: 2024,
    
  },
  {
    year: 2025,
    content: `started building projects and learning new technologies.
    and also started the project docement based ai models (like rag model)`,
  },
  {
    year: 2026,
    content: `completed my engineering and started my journey in the field  of software engineering `,
  },
]
