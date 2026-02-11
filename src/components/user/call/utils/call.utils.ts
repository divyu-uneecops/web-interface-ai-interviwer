// Penalty/event form instance config (forminstances API for exit fullscreen & face validation events)
const PENALTY_FORM_ID = "698c16d7fdb0e9975c9f5e9c";
const PENALTY_PROPERTY_IDS = {
  interviewId: "698c17cd2d28552b6f555919",
  eventType: "698c1813ac16de7384384f10",
  timeStamp: "698c185e2d28552b6f55591a",
};
const PENALTY_PROPERTY_IDS_LIST = [
  PENALTY_PROPERTY_IDS.interviewId,
  PENALTY_PROPERTY_IDS.eventType,
  PENALTY_PROPERTY_IDS.timeStamp,
];

export function buildPenaltyPayload(
  interviewId: string,
  eventType: string,
  timeStamp: number
) {
  return {
    values: [
      {
        propertyId: PENALTY_PROPERTY_IDS.interviewId,
        key: "interviewId",
        value: interviewId,
      },
      {
        propertyId: PENALTY_PROPERTY_IDS.eventType,
        key: "eventType",
        value: eventType,
      },
      {
        propertyId: PENALTY_PROPERTY_IDS.timeStamp,
        key: "timeStamp",
        value: timeStamp,
      },
    ],
    propertyIds: PENALTY_PROPERTY_IDS_LIST,
    flows: [],
    status: "PENDING",
    formId: PENALTY_FORM_ID,
  };
}
