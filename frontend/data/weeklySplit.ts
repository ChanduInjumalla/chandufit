export interface SplitExercise {
    name: string;
    main: string;
    secondary: string;
    variation: string;
    sets: string;
    reps: string;
    formTips: string[];
    mistakes: string[];
}

export interface SplitDay {
    day: number;
    title: string;
    color: string;
    icon: string;
    groups: {
        name: string;
        color: string;
        exercises: SplitExercise[];
    }[];
}

export const weeklySplit: SplitDay[] = [
    {
        day: 1, title: 'Chest + Triceps', color: '#ef4444', icon: '🔴',
        groups: [
            {
                name: 'CHEST', color: '#ef4444',
                exercises: [
                    { name: 'Barbell Bench Press', main: 'Middle Chest', secondary: 'Front Delts, Triceps', variation: 'Dumbbell Bench Press', sets: '4', reps: '8-10', formTips: ['Arch your back slightly — shoulder blades pinched', 'Grip just wider than shoulder width', 'Lower bar to mid-chest level', 'Drive feet into floor for stability', 'Full lockout at top'], mistakes: ['Bouncing bar off chest', 'Flaring elbows out 90°', 'Lifting hips off bench'] },
                    { name: 'Incline Dumbbell Press', main: 'Upper Chest', secondary: 'Front Delts, Triceps', variation: 'Incline Barbell Press', sets: '3', reps: '10-12', formTips: ['Set bench to 30-45° incline', 'Start dumbbells at shoulder level', 'Press up in a slight arc', 'Squeeze chest hard at top'], mistakes: ['Too steep incline (becomes shoulder press)', 'Not controlling the negative'] },
                    { name: 'Cable Chest Fly', main: 'Inner Chest', secondary: 'Front Delts', variation: 'Pec Deck', sets: '3', reps: '12-15', formTips: ['Slight bend in elbows throughout', 'Bring hands together in front of chest', 'Squeeze and hold 1 sec at center', 'Lean slightly forward'], mistakes: ['Using too heavy weight', 'Bending arms too much (becomes press)'] },
                    { name: 'Machine Chest Press', main: 'Overall Chest', secondary: 'Triceps', variation: 'Smith Machine Press', sets: '3', reps: '10-12', formTips: ['Adjust seat so handles align with mid-chest', 'Full range of motion', 'Slow controlled negative 2-3 sec', 'Don\'t lock elbows aggressively'], mistakes: ['Seat too high or too low', 'Using momentum'] },
                ]
            },
            {
                name: 'TRICEPS', color: '#3b82f6',
                exercises: [
                    { name: 'Rope Pushdown', main: 'Lateral Head', secondary: 'Forearms', variation: 'Straight Bar Pushdown', sets: '3', reps: '12-15', formTips: ['Keep elbows pinned to sides', 'Split rope apart at bottom', 'Squeeze triceps at full extension', 'Lean slightly forward'], mistakes: ['Elbows moving forward', 'Using body momentum to push down'] },
                    { name: 'Overhead DB Extension', main: 'Long Head', secondary: 'Stabilizer muscles', variation: 'EZ Bar Overhead Extension', sets: '3', reps: '10-12', formTips: ['Hold one heavy dumbbell with both hands', 'Keep upper arms vertical', 'Lower behind head, stretch triceps', 'Press up without moving elbows'], mistakes: ['Flaring elbows outward', 'Arching lower back excessively'] },
                    { name: 'Bench Dips', main: 'Full Triceps', secondary: 'Lower Chest', variation: 'Parallel Bar Dips', sets: '3', reps: '12-15', formTips: ['Hands shoulder-width on bench edge', 'Lower until 90° elbow angle', 'Push through palms to lockout', 'Keep back close to bench'], mistakes: ['Going too deep (shoulder strain)', 'Rushing the movement'] },
                ]
            }
        ]
    },
    {
        day: 2, title: 'Back + Biceps', color: '#3b82f6', icon: '🔵',
        groups: [
            {
                name: 'BACK', color: '#3b82f6',
                exercises: [
                    { name: 'Lat Pulldown (Wide Grip)', main: 'Lats (Width)', secondary: 'Biceps', variation: 'Pull-ups', sets: '4', reps: '8-10', formTips: ['Grip slightly wider than shoulders', 'Pull bar to upper chest', 'Lean back 15-20°', 'Squeeze lats at bottom, stretch at top'], mistakes: ['Pulling bar behind neck', 'Using momentum/swinging'] },
                    { name: 'Barbell Row', main: 'Mid Back Thickness', secondary: 'Rear Delts, Biceps', variation: 'T-Bar Row', sets: '4', reps: '8-10', formTips: ['Hinge at hips, 45° torso angle', 'Pull bar to lower ribcage', 'Squeeze shoulder blades together', 'Keep core braced throughout'], mistakes: ['Rounding lower back', 'Standing too upright'] },
                    { name: 'Seated Cable Row', main: 'Middle Back', secondary: 'Biceps', variation: 'Chest Supported Row', sets: '3', reps: '10-12', formTips: ['Sit upright with slight lean forward', 'Pull handle to belly button', 'Pinch shoulder blades at contraction', 'Control the return stretch'], mistakes: ['Excessive body swinging', 'Rounding shoulders forward'] },
                    { name: 'Straight Arm Pulldown', main: 'Lower Lats', secondary: 'Core Stabilization', variation: 'Dumbbell Pullover', sets: '3', reps: '12-15', formTips: ['Stand arm-length from cable', 'Keep arms straight, slight elbow bend', 'Pull bar down to thighs in an arc', 'Focus on lat contraction'], mistakes: ['Bending elbows too much', 'Using too heavy weight'] },
                ]
            },
            {
                name: 'BICEPS', color: '#10b981',
                exercises: [
                    { name: 'Barbell Curl', main: 'Long + Short Head', secondary: 'Forearms', variation: 'EZ Bar Curl', sets: '3', reps: '10-12', formTips: ['Stand with feet shoulder-width', 'Curl bar up squeezing biceps', 'Control the negative 2-3 sec', 'Keep elbows at your sides'], mistakes: ['Swinging body for momentum', 'Moving elbows forward'] },
                    { name: 'Incline DB Curl', main: 'Long Head', secondary: 'Forearms', variation: 'Bayesian Cable Curl', sets: '3', reps: '10-12', formTips: ['Set bench to 45° incline', 'Let arms hang naturally behind torso', 'Curl up without moving upper arm', 'This stretches the long head — great for peak'], mistakes: ['Sitting too upright', 'Swinging dumbbells'] },
                    { name: 'Hammer Curl', main: 'Brachialis', secondary: 'Forearms', variation: 'Rope Hammer Curl', sets: '3', reps: '12-15', formTips: ['Neutral grip (palms facing each other)', 'Curl up keeping wrist straight', 'Works the brachialis for arm thickness', 'Alternate or both arms together'], mistakes: ['Rotating wrists during curl', 'Using body swing'] },
                ]
            }
        ]
    },
    {
        day: 3, title: 'Legs (Full)', color: '#10b981', icon: '🟢',
        groups: [
            {
                name: 'LEGS', color: '#10b981',
                exercises: [
                    { name: 'Barbell Squat', main: 'Quads', secondary: 'Glutes, Core', variation: 'Hack Squat', sets: '4', reps: '6-8', formTips: ['Bar on upper back (not neck)', 'Feet shoulder-width, toes slightly out', 'Break at hips and knees simultaneously', 'Go below parallel if flexibility allows', 'Drive through heels to stand'], mistakes: ['Knees caving inward', 'Rounding lower back', 'Heels coming off floor'] },
                    { name: 'Leg Press', main: 'Quads', secondary: 'Glutes', variation: 'Single Leg Press', sets: '3', reps: '10-12', formTips: ['Feet shoulder-width on platform', 'Lower sled until 90° knee angle', 'Push through full foot', 'Don\'t lock out completely at top'], mistakes: ['Placing feet too high/low', 'Letting lower back lift off pad'] },
                    { name: 'Romanian Deadlift', main: 'Hamstrings', secondary: 'Glutes', variation: 'Dumbbell RDL', sets: '3', reps: '10-12', formTips: ['Hold bar at hip height', 'Push hips BACK, slight knee bend', 'Lower bar along legs until hamstring stretch', 'Squeeze glutes to return up'], mistakes: ['Rounding back', 'Bending knees too much (not a squat)'] },
                    { name: 'Walking Lunges', main: 'Glutes', secondary: 'Quads', variation: 'Bulgarian Split Squat', sets: '3', reps: '12 each leg', formTips: ['Long stride forward', 'Back knee almost touches ground', 'Keep torso upright', 'Drive through front heel'], mistakes: ['Short steps (less glute work)', 'Knee going past toes excessively'] },
                    { name: 'Leg Curl', main: 'Hamstrings', secondary: 'Calves', variation: 'Seated Leg Curl', sets: '3', reps: '12-15', formTips: ['Pad on lower calves', 'Curl heels toward glutes', 'Hold contraction 1 sec', 'Control the negative'], mistakes: ['Lifting hips off pad', 'Using momentum'] },
                    { name: 'Standing Calf Raise', main: 'Gastrocnemius', secondary: 'Soleus', variation: 'Seated Calf Raise', sets: '4', reps: '15-20', formTips: ['Full stretch at bottom — heels below platform', 'Rise up on toes as high as possible', 'Hold peak contraction 1 sec', 'Slow negative for maximum stretch'], mistakes: ['Bouncing/partial reps', 'Not going through full ROM'] },
                ]
            }
        ]
    },
    {
        day: 4, title: 'Shoulders + Abs', color: '#f59e0b', icon: '🟡',
        groups: [
            {
                name: 'SHOULDERS', color: '#f59e0b',
                exercises: [
                    { name: 'Seated DB Press', main: 'Front Delts', secondary: 'Triceps', variation: 'Barbell Overhead Press', sets: '4', reps: '8-10', formTips: ['Sit upright with back support', 'Start dumbbells at ear level', 'Press straight up overhead', 'Don\'t lock elbows aggressively'], mistakes: ['Arching back excessively', 'Flaring elbows too wide'] },
                    { name: 'Lateral Raises', main: 'Side Delts', secondary: 'Traps', variation: 'Cable Lateral Raise', sets: '4', reps: '12-15', formTips: ['Slight bend in elbows', 'Raise arms out to sides until parallel', 'Lead with elbows, not hands', 'Control the negative slowly'], mistakes: ['Raising above shoulder height', 'Using momentum/swinging'] },
                    { name: 'Rear Delt Fly', main: 'Rear Delts', secondary: 'Upper Back', variation: 'Face Pulls', sets: '3', reps: '12-15', formTips: ['Bend at hips or use machine', 'Arms slightly bent, squeeze back', 'Focus on rear delt contraction', 'Don\'t use traps to pull'], mistakes: ['Rounding upper back', 'Going too heavy'] },
                    { name: 'Upright Row', main: 'Side Delts', secondary: 'Traps', variation: 'Cable Upright Row', sets: '3', reps: '10-12', formTips: ['Grip narrower than shoulder width', 'Pull bar up to chin level', 'Lead with elbows going high', 'Keep bar close to body'], mistakes: ['Grip too narrow (wrist pain)', 'Internal rotation at top'] },
                ]
            },
            {
                name: 'ABS', color: '#8b5cf6',
                exercises: [
                    { name: 'Hanging Leg Raise', main: 'Lower Abs', secondary: 'Hip Flexors', variation: 'Captain\'s Chair Leg Raise', sets: '3', reps: '12-15', formTips: ['Hang from bar with straight arms', 'Raise legs to 90° or higher', 'Curl pelvis upward at top', 'Control the descent'], mistakes: ['Swinging body', 'Using hip flexors only'] },
                    { name: 'Cable Crunch', main: 'Upper Abs', secondary: 'Core', variation: 'Weighted Decline Crunch', sets: '3', reps: '15-20', formTips: ['Kneel facing cable, rope behind head', 'Crunch down curling spine', 'Focus on abs doing the work', 'Hold contraction 1 sec'], mistakes: ['Pulling with arms', 'Hip hinging instead of crunching'] },
                    { name: 'Plank', main: 'Core Stability', secondary: 'Shoulders, Glutes', variation: 'Side Plank', sets: '3', reps: '30-60 sec', formTips: ['Forearms on ground, body straight line', 'Squeeze glutes and core tight', 'Don\'t let hips sag or pike up', 'Breathe steadily'], mistakes: ['Hips dropping', 'Looking up (neck strain)'] },
                ]
            }
        ]
    },
    {
        day: 5, title: 'Chest + Back (2nd Hit)', color: '#ef4444', icon: '🔴',
        groups: [
            {
                name: 'CHEST', color: '#ef4444',
                exercises: [
                    { name: 'Incline Barbell Bench Press', main: 'Upper Chest', secondary: 'Front Delts, Triceps', variation: 'Incline Dumbbell Press', sets: '4', reps: '8-10', formTips: ['Set bench to 30° incline', 'Grip slightly wider than shoulders', 'Lower to upper chest', 'Drive up explosively'], mistakes: ['Too steep angle', 'Bouncing bar'] },
                    { name: 'Flat Dumbbell Press', main: 'Middle Chest', secondary: 'Triceps', variation: 'Barbell Bench Press', sets: '3', reps: '10-12', formTips: ['Dumbbells at shoulder level to start', 'Press up in slight arc', 'Touch dumbbells at top', 'Full stretch at bottom'], mistakes: ['Dumbbells going too wide', 'Not enough range of motion'] },
                    { name: 'Pec Deck Fly', main: 'Inner Chest', secondary: 'Front Delts', variation: 'Cable Crossover', sets: '3', reps: '12-15', formTips: ['Adjust seat height — arms at chest level', 'Squeeze handles together in front', 'Hold peak contraction 1-2 sec', 'Slow return to start'], mistakes: ['Using too much weight', 'Short range of motion'] },
                    { name: 'Decline Push-ups', main: 'Lower Chest', secondary: 'Triceps', variation: 'Dips', sets: '3', reps: '15-20', formTips: ['Feet elevated on bench', 'Hands wider than shoulders', 'Lower chest to floor', 'Full lockout at top'], mistakes: ['Hips sagging', 'Not going deep enough'] },
                ]
            },
            {
                name: 'BACK', color: '#3b82f6',
                exercises: [
                    { name: 'Wide Grip Pull-ups', main: 'Upper Lats (Width)', secondary: 'Biceps', variation: 'Assisted Pull-ups', sets: '4', reps: '6-10', formTips: ['Grip wider than shoulders', 'Pull yourself up until chin over bar', 'Focus on pulling with lats, not arms', 'Full dead hang at bottom'], mistakes: ['Kipping/swinging', 'Not full range of motion'] },
                    { name: 'T-Bar Row', main: 'Mid Back Thickness', secondary: 'Rear Delts, Biceps', variation: 'Chest Supported Row', sets: '3', reps: '10-12', formTips: ['Straddle the bar', 'Bent at 45° hip angle', 'Pull handle to chest/stomach', 'Squeeze back at top'], mistakes: ['Rounding lower back', 'Standing up during rep'] },
                    { name: 'Single Arm Dumbbell Row', main: 'Lats', secondary: 'Core Stabilization', variation: 'Machine Row', sets: '3', reps: '10-12 each', formTips: ['One hand/knee on bench', 'Row dumbbell to hip level', 'Focus on lat pull, not arm', 'Keep torso parallel to floor'], mistakes: ['Rotating torso', 'Pulling with bicep only'] },
                    { name: 'Close Grip Lat Pulldown', main: 'Lower Lats', secondary: 'Biceps', variation: 'Neutral Grip Pulldown', sets: '3', reps: '10-12', formTips: ['V-bar or close neutral grip', 'Pull to upper chest', 'Lean back slightly', 'Full stretch at top'], mistakes: ['Going too heavy', 'Not full ROM'] },
                ]
            }
        ]
    },
    {
        day: 6, title: 'Arms + Forearms', color: '#3b82f6', icon: '🔵',
        groups: [
            {
                name: 'TRICEPS', color: '#ef4444',
                exercises: [
                    { name: 'Close Grip Bench Press', main: 'Overall Triceps', secondary: 'Chest', variation: 'Smith Close Grip Press', sets: '4', reps: '8-10', formTips: ['Hands shoulder-width apart (not too close)', 'Lower to lower chest', 'Elbows stay close to body', 'Lock out fully to work triceps'], mistakes: ['Grip too narrow (wrist pain)', 'Flaring elbows out'] },
                    { name: 'EZ Bar Skull Crushers', main: 'Long Head', secondary: 'Elbow Stabilizers', variation: 'Dumbbell Skull Crushers', sets: '3', reps: '10-12', formTips: ['Lie on flat bench', 'Lower EZ bar to forehead level', 'Keep upper arms vertical', 'Extend fully at top'], mistakes: ['Elbows flaring out', 'Lowering behind head too far'] },
                    { name: 'Cable Tricep Kickbacks', main: 'Lateral Head', secondary: 'Rear Delts Stabilization', variation: 'Rope Pushdown', sets: '3', reps: '12-15', formTips: ['Hinge forward at hips', 'Keep upper arm parallel to floor', 'Extend arm fully behind you', 'Squeeze at full extension'], mistakes: ['Dropping upper arm', 'Too much weight (can\'t full extend)'] },
                ]
            },
            {
                name: 'BICEPS', color: '#10b981',
                exercises: [
                    { name: 'Preacher Curl', main: 'Short Head (Peak)', secondary: 'Forearms', variation: 'EZ Bar Preacher Curl', sets: '3', reps: '10-12', formTips: ['Armpits rest on top of pad', 'Curl all the way up to shoulder level', 'Slow controlled negative 3 sec', 'Full stretch at bottom'], mistakes: ['Not going full ROM', 'Using momentum to swing up'] },
                    { name: 'Concentration Curl', main: 'Biceps Peak', secondary: 'Forearm', variation: 'Spider Curl', sets: '3', reps: '10-12', formTips: ['Sit on bench, elbow on inner thigh', 'Curl up squeezing biceps hard', 'Turn wrist slightly outward at top (supinate)', 'Slow negative, feel the stretch'], mistakes: ['Moving entire arm', 'Not fully contracting at top'] },
                    { name: 'Reverse Barbell Curl', main: 'Brachialis', secondary: 'Forearms', variation: 'Reverse Cable Curl', sets: '3', reps: '12-15', formTips: ['Overhand grip on barbell', 'Curl up keeping wrists straight', 'Focus on top side of forearm burning', 'Builds arm thickness'], mistakes: ['Using too heavy weight', 'Bending wrists'] },
                ]
            },
            {
                name: 'FOREARMS', color: '#92400e',
                exercises: [
                    { name: 'Barbell Wrist Curls', main: 'Forearm Flexors', secondary: 'Grip Strength', variation: 'Dumbbell Wrist Curl', sets: '3', reps: '15-20', formTips: ['Sit with forearms on thighs, wrists over edge', 'Curl wrists upward squeezing', 'Let bar roll to fingertips at bottom for extra ROM', 'Slow and controlled'], mistakes: ['Moving entire forearm', 'Going too heavy'] },
                ]
            }
        ]
    },
];
