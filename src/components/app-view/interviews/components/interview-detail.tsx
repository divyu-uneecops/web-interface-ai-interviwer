"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { InterviewDetail as InterviewDetailType } from "../interfaces/interview.interface";
import { InterviewDetailData } from "../interfaces/interview-detail.interface";
import { mockInterviewDetailData } from "../constants/interview-detail.constants";
import { formatInterviewDate } from "../utils/interview.utils";

export default function InterviewDetail() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<>({
    id: "1",
    candidateName: "John Doe",
    candidateEmail: "john.doe@example.com",
    jobTitle: "Software Engineer",
    interviewerName: "Jane Doe",
    status: "Completed",
    interviewDate: "2024-01-20",
    roundName: "Round 1",
    score: 85,
    duration: 45,
  });
  const [detailData, setDetailData] = useState<InterviewDetailData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get detail data (use interview id or default to "1")
    const data = mockInterviewDetailData["1"];
    setDetailData(data);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!interview || !detailData) {
    return (
      <div className="text-center py-12">
        <p className="text-[#737373]">Interview not found</p>
        <Link
          href="/app-view/interviews"
          className="text-[#02563d] hover:underline mt-4 inline-block"
        >
          Back to Interviews
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between">
        <div className="flex">
          <ChevronLeft
            className="cursor-pointer mr-2"
            onClick={() => router.back()}
          />

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-bold text-[#0a0a0a] leading-7">
                {interview.candidateName}
              </h1>
              <Badge
                variant="outline"
                className={`bg-[#def2eb] font-normal text-xs tracking-[0.3px] rounded-full px-2 py-0 h-6 border-transparent text-[#0e4230]`}
              >
                {interview.status}
              </Badge>
            </div>
            <p className="text-xs text-[#737373] leading-none">
              {interview.jobTitle} • {interview.candidateEmail}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-start">
          <div className="flex items-center gap-1 text-xs text-[#404040]">
            <Calendar className="w-4 h-4" />
            <span>
              Interview date: {formatInterviewDate(interview.interviewDate)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#404040]">
            <Clock className="w-4 h-4" />
            <span>Duration: {interview.duration} minutes</span>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-[rgba(2,86,61,0.05)] border-2 border-[#e5e5e5] rounded-xl p-[26px] h-[218px]">
        <div className="flex items-center justify-between h-full">
          <div className="flex flex-col gap-2 h-[88px]">
            <h2 className="text-2xl font-bold text-[#45556c] leading-[32px]">
              Overall Interview Score
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#02563d] leading-8">
                {detailData.overallScore}
              </span>
              <span className="text-sm text-[#737373] leading-none">/100</span>
            </div>
            <p className="text-sm text-[#45556c] leading-5">
              {detailData.recommendation}
            </p>
          </div>
          <div className="relative h-[166px] w-[160px]">
            <div className="absolute bg-white border-8 border-[#02563d] rounded-full w-32 h-32 left-4 top-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="text-[30px] leading-[36px] text-[#02563d]">
                  {detailData.grade}
                </span>
                <span className="text-xs text-[#02563d] leading-4">Grade</span>
              </div>
            </div>
            <div className="absolute bg-[#02563d] text-white text-sm px-3 py-1 rounded-md whitespace-nowrap left-0 top-[140px] w-full text-center">
              {detailData.percentile}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="score" className="w-full">
        <TabsList className="bg-[#f5f5f5] h-9 w-[400px] p-[3px] rounded-lg">
          <TabsTrigger
            value="score"
            className="flex-1 h-full rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Score & criteria
          </TabsTrigger>
          <TabsTrigger
            value="transcript"
            className="flex-1 h-full rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Interview transcript
          </TabsTrigger>
        </TabsList>

        {/* Score & Criteria Tab */}
        <TabsContent value="score" className="mt-0">
          <div className="bg-white rounded p-3 space-y-8 mt-6">
            <h3 className="text-sm font-medium text-[#0a0a0a] leading-[18px]">
              Evaluation criteria breakdown
            </h3>

            {/* Criteria Scores */}
            {detailData.criteriaScores.map((criteria, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                      {criteria.name}
                    </p>
                    <p className="text-xs text-[#737373] leading-4">
                      {criteria.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 items-end">
                    <p className="text-base font-bold text-[#15803d] leading-6">
                      {criteria.score}
                    </p>
                    <p className="text-xs text-[#737373] leading-4">
                      Avg. industry score: {criteria.industryAverage}
                    </p>
                  </div>
                </div>
                <Slider
                  value={[criteria.score]}
                  max={100}
                  disabled
                  className="h-1.5"
                />
              </div>
            ))}

            {/* Strengths and Areas for Growth */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {/* Strengths Card */}
              <div className="bg-[#f0fdf4] border border-[#b9f8cf] rounded-xl p-[25px] space-y-[30px]">
                <div className="flex items-center gap-2 h-[28px]">
                  <CheckCircle2 className="w-5 h-5 text-[#016630]" />
                  <h4 className="text-lg font-bold text-[#016630] leading-7">
                    Strengths
                  </h4>
                </div>
                <ul className="space-y-2">
                  {detailData.feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex gap-2 items-start h-5">
                      <span className="text-[#00a63e] text-sm leading-5">
                        ✓
                      </span>
                      <span className="text-sm text-[#016630] leading-5">
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Growth Card */}
              <div className="bg-[#fff7ed] border border-[#ffd6a7] rounded-xl p-[25px] space-y-[30px]">
                <div className="flex items-center gap-2 h-[28px]">
                  <AlertCircle className="w-5 h-5 text-[#9f2d00]" />
                  <h4 className="text-lg font-bold text-[#9f2d00] leading-7">
                    Areas for Growth
                  </h4>
                </div>
                <ul className="space-y-2">
                  {detailData.feedback.areasForGrowth.map((area, index) => (
                    <li key={index} className="flex gap-2 items-start h-5">
                      <span className="text-[#f54900] text-sm leading-5">
                        →
                      </span>
                      <span className="text-sm text-[#9f2d00] leading-5">
                        {area}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Interview Transcript Tab */}
        <TabsContent value="transcript" className="mt-0">
          <div className="bg-white rounded p-3 mt-6">
            <h3 className="text-sm font-medium text-[#0a0a0a] leading-[18px] mb-4">
              Full interview transcript
            </h3>

            <div className="space-y-4">
              {detailData.transcript.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] border border-[#e5e5e5] rounded-lg p-3 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                        Question {index + 1} :
                      </p>
                      <p className="text-sm text-[#737373] leading-5">
                        {item.question}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === "skipped" ? "destructive" : "outline"
                      }
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        item.status === "skipped"
                          ? "bg-[#dc2626] text-white border-transparent"
                          : "bg-white border-[#e5e5e5] text-[#0a0a0a]"
                      }`}
                    >
                      {item.duration}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                      Response :
                    </p>
                    <p className="text-sm text-[#737373] leading-5 whitespace-pre-wrap">
                      {item.response}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
