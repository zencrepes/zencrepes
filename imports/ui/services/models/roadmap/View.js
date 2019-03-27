import {
    cfgMilestones,
    cfgIssues,
} from "../../../data/Minimongo";

import { formatDate, formatDateEoD } from "../../../utils/shared.js";

import {getAssigneesRepartition} from "../../../utils/repartition";

// To-Do: Remove this code that was put there for testing, coming from: https://github.com/JSainsburyPLC/react-timelines#readme
export const addMonthsToYear = (year, monthsToAdd) => {
    let y = year
    let m = monthsToAdd
    while (m >= 12) {
        m -= 12
        y += 1
    }
    return { year: y, month: m + 1 }
};

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const addMonthsToYearAsDate = (year, monthsToAdd) => {
    const r = addMonthsToYear(year, monthsToAdd)
    return new Date(`${r.year}-${r.month}`)
};

export const buildQuarterCells = (timeYearStart, timeYearEnd) => {
    let numberYears = timeYearEnd - timeYearStart;
    if (numberYears < 1) {numberYears = 1;}
    const numberQuarters = numberYears * 3;
    const v = [];
    for (let i = 0; i < 3 * numberQuarters; i += 1) {
        const quarter = (i % 4) + 1
        const startMonth = i * 3
        const s = addMonthsToYear(timeYearStart, startMonth)
        const e = addMonthsToYear(timeYearStart, startMonth + 3)
        v.push({
            id: `${s.year}-q${quarter}`,
            title: `Q${quarter} ${s.year}`,
            start: new Date(`${s.year}-${s.month}-01`),
            end: new Date(`${e.year}-${e.month}-01`),
        })
    }
    return v
};

export const buildMonthCells = (timeYearStart, timeYearEnd) => {
    let numberYears = timeYearEnd - timeYearStart + 1;
    if (numberYears < 1) {numberYears = 1;}
    const v = [];
    for (let i = 0; i < 12 * numberYears; i += 1) {
        const startMonth = i
        const start = addMonthsToYearAsDate(timeYearStart, startMonth)
        const end = addMonthsToYearAsDate(timeYearStart, startMonth + 1)
        v.push({
            id: `m${startMonth}`,
            title: MONTH_NAMES[i % 12],
            start,
            end,
        })
    }
    return v
};

export default {
    state: {
        issues: [],
        milestones: [],
        query: {'state':{'$in':['OPEN']}},

        timelineStart: new Date(),
        timelineEnd: new Date(),
        timebar: [],
        tracks: [],
        showClosed: false,
    },
    reducers: {
        setIssues(state, payload) {return { ...state, issues: payload };},
        setMilestones(state, payload) {return { ...state, milestones: payload };},
        setQuery(state, payload) {return { ...state, query: payload };},
        setShowClosed(state, payload) {return { ...state, showClosed: payload };},

        setTimelineStart(state, payload) {return { ...state, timelineStart: payload };},
        setTimelineEnd(state, payload) {return { ...state, timelineEnd: payload };},
        setTimebar(state, payload) {return { ...state, timebar: payload };},
        setTracks(state, payload) {return { ...state, tracks: payload };},
    },
    effects: {
        async updateShowClosed(showClosed) {
            this.setShowClosed(showClosed);
            if (showClosed === true) {
                this.updateQuery({'state':{'$in':['OPEN', 'CLOSED']}});
            } else {
                this.updateQuery({'state':{'$in':['OPEN']}});
            }
        },

        async updateQuery(query) {
            if (query === null) {this.setQuery({});}
            else {this.setQuery(query);}
            this.updateView();
        },

        async updateView(payload, rootState) {
            this.setMilestones(cfgMilestones.find(rootState.roadmapView.query).fetch());

            this.updateTimelineWindow();
            this.updateTracks();
        },

        async updateTimelineWindow(payload, rootState) {
            // Timeline window definition:
            // Start: Earliest closed issue
            // End: Latest milestone dueOn (or latest closed issue, whichever is oldest)


            // Start timeline is defined by the first ever issue closed over across all milestones
            const msIds = rootState.roadmapView.milestones.map(ms => ms.id);
            const mongoFilter = {"milestone.id":{"$in":msIds}, "state": 'CLOSED'};
            let timelineStart = formatDate(cfgIssues.findOne(mongoFilter, { sort: { closedAt: 1 }, reactive: false, transform: null }).closedAt);
            timelineStart = new Date(timelineStart.getFullYear(), 0, 1);
            this.setTimelineStart(timelineStart);

            // End timeline with the futher away dueOn
            let timelineEnd = formatDate(cfgMilestones.findOne(rootState.roadmapView.query, { sort: { dueOn: -1 }, reactive: false, transform: null }).dueOn);
            //timelineEnd.setDate(timelineEnd.getDate() - 1);
            timelineEnd = new Date(timelineEnd.getFullYear()+1, 0, 1);
            timelineEnd.setDate(timelineEnd.getDate() - 1);
            this.setTimelineEnd(timelineEnd);
            //cfgIssues.findOne(mongoFilter, { sort: { closedAt: 1 }, reactive: false, transform: null }).closedAt);

            const timeYearStart = timelineStart.getFullYear();
            const timeYearEnd = timelineEnd.getFullYear();

            const timebar = [
                {
                    id: 'quarters',
                    title: 'Quarters',
                    cells: buildQuarterCells(timeYearStart, timeYearEnd),
                    style: {
                    },
                },
                {
                    id: 'months',
                    title: 'Months',
                    cells: buildMonthCells(timeYearStart, timeYearEnd),
                    useAsGrid: true,
                    style: {
                    },
                },
            ];

            this.setTimebar(timebar);
        },

        async openCloseTrack(track, rootState) {
            //https://stackoverflow.com/questions/35206125/javascript-es6-es5-find-in-array-and-change
            const idx = rootState.roadmapView.tracks.findIndex(x => x.id == track.id);
            rootState.roadmapView.tracks[idx].isOpen = !track.isOpen;
            this.setTracks(rootState.roadmapView.tracks);
        },

        async updateTracks(payload, rootState) {
            const allMilestones = cfgMilestones.find(rootState.roadmapView.query, { sort: { dueOn: 1 }, reactive: false, transform: null }).fetch().filter(ms => ms.dueOn !== null);

            //From: https://stackoverflow.com/questions/53542882/es6-removing-duplicates-from-array-of-objects
            const keys = ['title'];
            const milestones = allMilestones.filter(
                (s => o =>
                        (k => !s.has(k) && s.add(k))(keys.map(k => o[k]).join('|'))
                )(new Set)
            );

            let thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);

            // Build tracks and display when work was happening, and how much time is it expected to take to complete the open issues based on today's velocity.
            const tracks = milestones.map((milestone) => {
                //Epics are listed as a children of the milestone
                const epics = cfgIssues.find({'milestone.title': milestone.title, "labels.edges":{"$elemMatch":{"node.name":{"$in":["Epic","meta"]}}}}, { sort: { closedAt: 1 }, reactive: false, transform: null }).fetch();

                let milestoneTrack = {
                    id: milestone.id,
                    isOpen: false,
                    title: milestone.title + ' (' + epics.length + ')',
                    elements: [],
                    tracks: [],
                };

                //Get first closed issue
                const firstIssue = cfgIssues.findOne({'milestone.title': milestone.title, 'state': 'CLOSED'}, { sort: { closedAt: 1 }, reactive: false, transform: null });
                let firstIssueClosed = null;
                if (firstIssue !== undefined) {
                    firstIssueClosed = formatDate(firstIssue.closedAt);
                }

                const lastIssue = cfgIssues.findOne({'milestone.title': milestone.title, 'state': 'CLOSED'}, { sort: { closedAt: -1 }, reactive: false, transform: null });
                let lastIssueClosed = null;
                if (lastIssue !== undefined) {
                    lastIssueClosed = formatDate(lastIssue.closedAt);
                }

                const closedIssues = {
                    id: 'closed' + milestone.id,
                    title: '',
                    issues: cfgIssues.find({'milestone.title': milestone.title, 'state': 'CLOSED'}, { sort: { closedAt: 1 }, reactive: false, transform: null }),
                    start: firstIssueClosed,
                    end: lastIssueClosed,
                    style: {
                        backgroundColor: '#40c4ff',
                        color: '#ffffff',
                        borderRadius: '4px',
                        boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
                        textTransform: 'capitalize',
                    }
                };
                milestoneTrack.elements.push(closedIssues);

                if (epics.length > 0) {
                    epics.forEach((epic) => {
                        let epicClosed = formatDate(new Date());
                        if (epic.state === 'CLOSED') {
                            epicClosed = formatDate(firstIssue.closedAt);
                        } else if (formatDate(new Date()) <= formatDate(milestone.dueOn)) {
                            epicClosed = formatDate(milestone.dueOn);
                        }
                        milestoneTrack.tracks.push({
                            id: epic.id,
                            title: epic.title,
                            elements: [{
                                id: 't'+epic.id,
                                title: 'Epic',
                                start: firstIssueClosed,
                                end: epicClosed,
                                style: {
                                    backgroundColor: '#40c4ff',
                                    color: '#ffffff',
                                    borderRadius: '4px',
                                    boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
                                    textTransform: 'capitalize',
                                }
                            }],
                        });
                    });
                }

                const openIssues = cfgIssues.find({'milestone.title': milestone.title, 'state': 'OPEN'}).fetch();

                if (openIssues.length > 0) {
                    // Velocity: Simple calculation,
                    //   estimate days to completion,
                    //   average daily over the past 30 days using all assignees for all open issues
                    const assigneesLogin = getAssigneesRepartition(openIssues).map((assignee) => assignee.login);
                    const closedLast30Days = cfgIssues.find({'assignees.edges':{'$elemMatch':{'node.login':{'$in':assigneesLogin}}}, 'state': 'CLOSED', closedAt: {'$gte': thirtyDaysAgo.toISOString()}}).fetch();

                    const completedPoints = closedLast30Days
                        .filter(issue => issue.points !== null)
                        .map(issue => issue.points)
                        .reduce((acc, points) => acc + points, 0);

                    const remainingPoints = openIssues
                        .filter(issue => issue.points !== null)
                        .map(issue => issue.points)
                        .reduce((acc, points) => acc + points, 0);

                    let velocity = {
                        completionPerDay: {
                            points: (completedPoints === 0 ? 0 : completedPoints/30),
                            issues: (closedLast30Days.length === 0 ? 0 : closedLast30Days.length/30)
                        },
                        remaining: {
                            points: remainingPoints,
                            issues: openIssues.length,
                        },
                        daysToCompletion: {
                            points: remainingPoints / completedPoints,
                            issues: openIssues.length / closedLast30Days.length,
                        }
                    };
                    velocity.daysToCompletion = {
                        points: velocity.remaining.points / velocity.completionPerDay.points,
                        issues: velocity.remaining.issues / velocity.completionPerDay.issues,
                    };

                    let completionDatePoints = new Date();
                    if (isNaN(velocity.daysToCompletion.points) === false && velocity.daysToCompletion.points !== Infinity) {
                        completionDatePoints.setDate(completionDatePoints.getDate()+velocity.daysToCompletion.points);
                    }

                    let completionDateIssues = new Date();
                    if (isNaN(velocity.daysToCompletion.issues) === false && velocity.daysToCompletion.issues !== Infinity) {
                        completionDateIssues.setDate(completionDateIssues.getDate()+velocity.daysToCompletion.issues);
                    }

                    velocity.completionDay = {
                        points: completionDatePoints,
                        issues: completionDateIssues,
                    };

                    const remainingWork = {
                        id: 'remaining' + milestone.id,
                        title: '',
                        issues: openIssues,
                        start: formatDate(new Date()),
                        end: velocity.completionDay.points,
                        style: {
                            backgroundColor: '#e0e0e0',
                            color: '#ffffff',
                            borderRadius: '4px',
                            boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
                            textTransform: 'capitalize',
                        }
                    };
                    milestoneTrack.elements.push(remainingWork);

                }

                const milestoneDue = {
                    id: 'due' + milestone.id,
                    title: '',
                    start: formatDate(milestone.dueOn),
                    end: formatDateEoD(milestone.dueOn),
                    style: {
                        backgroundColor: '#00e676',
                        color: '#ffffff',
                        borderRadius: '4px',
                        boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
                        textTransform: 'capitalize',
                    }
                };
                milestoneTrack.elements.push(milestoneDue);

                return milestoneTrack;

/*

                // Small trick to return the first milestone with dueOn date state
                //const milestone = cfgMilestones.find({'title': milestone.title}, { sort: { dueOn: -1 }, reactive: false, transform: null }).fetch().filter(ms => ms.dueOn !== null)[0];
                let milestoneDueOn = milestone.dueOn;
                if ( milestoneDueOn !== null) {
                    milestoneDueOn = formatDate(milestoneDueOn);
                }



                let timeToCompletion = null;

                if (milestoneDueOn !== null) {
                    console.log('test');
                    // 1- Get list of issues, sorted by date, before Due Date
                    const issuesClosedBeforeDue = cfgIssues.find({'milestone.title': milestone.title, 'state': 'CLOSED', 'closedAt': {'$lte': milestone.dueOn}}, { sort: { closedAt: 1 }, reactive: false, transform: null }).fetch();

                    // 2- Get list of issues, sorted by date, after Due Date and until today
                    const issuesClosedAfterDue = cfgIssues.find({'milestone.title': milestone.title, 'state': 'CLOSED', 'closedAt': {'$gt': milestone.dueOn}}, { sort: { closedAt: 1 }, reactive: false, transform: null }).fetch();

                    // 3- Get list of issues still open, estimate velocity
                    const issuesStillOpen = cfgIssues.find({'milestone.title': milestone.title, 'state': 'OPEN'}).fetch();

                    if  (issuesStillOpen.length > 0) {
                        // Velocity: Simple calculation,
                        //   estimate days to completion,
                        //   average daily over the past 30 days using all assignees for all open issues

                        const assigneesLogin = getAssigneesRepartition(issuesStillOpen).map((assignee) => assignee.login);

                        const closedLast30Days = cfgIssues.find({'assignees.edges':{'$elemMatch':{'node.login':{'$in':assigneesLogin}}}, 'state': 'CLOSED', closedAt: {'$gte': thirtyDaysAgo.toISOString()}}).fetch();

                        const completedPoints = closedLast30Days
                            .filter(issue => issue.points !== null)
                            .map(issue => issue.points)
                            .reduce((acc, points) => acc + points, 0);

                        const remainingPoints = issuesStillOpen
                            .filter(issue => issue.points !== null)
                            .map(issue => issue.points)
                            .reduce((acc, points) => acc + points, 0);

                        let velocity = {
                            completionPerDay: {
                                points: (completedPoints === 0 ? 0 : completedPoints/30),
                                issues: (closedLast30Days.length === 0 ? 0 : closedLast30Days.length/30)
                            },
                            remaining: {
                                points: remainingPoints,
                                issues: issuesStillOpen.length,
                            },
                            daysToCompletion: {
                                points: remainingPoints / completedPoints,
                                issues: issuesStillOpen.length / closedLast30Days.length,
                            }
                        };
                        velocity.daysToCompletion = {
                            points: velocity.remaining.points / velocity.completionPerDay.points,
                            issues: velocity.remaining.issues / velocity.completionPerDay.issues,
                        };

                        let completionDatePoints = new Date();
                        if (isNaN(velocity.daysToCompletion.points) === false && velocity.daysToCompletion.points !== Infinity) {
                            completionDatePoints.setDate(completionDatePoints.getDate()+velocity.daysToCompletion.points);
                        }

                        let completionDateIssues = new Date();
                        if (isNaN(velocity.daysToCompletion.issues) === false && velocity.daysToCompletion.issues !== Infinity) {
                            completionDateIssues.setDate(completionDateIssues.getDate()+velocity.daysToCompletion.issues);
                        }

                        velocity.completionDay = {
                            points: completionDatePoints,
                            issues: completionDateIssues,
                        };
                        console.log(velocity);

                        timeToCompletion = {
                            id: 'pastOnTime' + milestone.id,
                            title: 'On Time',
                            issues: issuesStillOpen,
                            start: formatDate(new Date()),
                            end: formatDate(velocity.completionDay.points),
                            style: {
                                backgroundColor: '#40c4ff',
                                color: '#ffffff',
                                borderRadius: '4px',
                                boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
                                textTransform: 'capitalize',
                            }
                        };

                    }

                    let milestoneTrack = {
                        id: milestone.id,
                        isOpen: false,
                        title: milestone.title,
                        elements: [],
                        tracks: [],
                    };

                    if (firstIssueClosed === null) {
                        firstIssueClosed = milestone.dueOn;
                    }

                    let deliveredBeforeDueEndDate = milestoneDueOn;
                    if (milestoneDueOn > formatDate(new Date())) {
                        deliveredBeforeDueEndDate = formatDate(new Date());
                    }

                    const deliveredBeforeDue = {
                        id: 'pastOnTime' + milestone.id,
                        title: 'On Time',
                        issues: issuesClosedBeforeDue,
                        start: formatDate(firstIssueClosed),
                        end: deliveredBeforeDueEndDate,
                        style: {
                            backgroundColor: '#40c4ff',
                            color: '#ffffff',
                            borderRadius: '4px',
                            boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
                            textTransform: 'capitalize',
                        }
                    };
                    milestoneTrack.elements.push(deliveredBeforeDue);

                    const milestoneDate = {
                        id: 'milestoneDate' + milestone.id,
                        title: 'M',
                        start: formatDate(milestone.dueOn),
                        end: formatDateEoD(milestone.dueOn),
                        style: {
                            backgroundColor: '#00e676',
                            color: '#ffffff',
                            borderRadius: '4px',
                            boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
                            textTransform: 'capitalize',
                        }
                    };
                    milestoneTrack.elements.push(milestoneDate);

                    if (timeToCompletion !== null) {
                        console.log('test');
                        milestoneTrack.elements.push(timeToCompletion);
                    }

                    if (issuesClosedAfterDue.length > 0) {
                        console.log(issuesClosedAfterDue);
                    }

                    return milestoneTrack;

                }
*/
            });
            //console.log(tracks);
            //console.log(tracks.filter(t => t !== undefined));
            this.setTracks(tracks.filter(t => t !== undefined));
        },


    }
};
