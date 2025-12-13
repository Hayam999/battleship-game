---------------- Dec 13, 2025 --------------

TODO limit evenListener to only responds if we clicked a not shooted cell before


---

---------- Dec 12, 2025 --------------
COMPLETE define addCircle()
COMPLETE define revealShip()

COMPLETE add sound effects

------------- Dec 7, 2025 --------------
COMPLETE review and fix rules for removing the forbidden area: because the ships don't keep the gaps between them correctly.

هل المكان اللى بتتحط فيه السفينه هو المكان اللى اختاره اللوجيك اللى كتبته وبناء عليه بيتم تحديد اماكن السفن؟" أيوه"
ازاى اتغلب على مشكلة السفينه الرأسيه واشيل الفرق فى المسافة ؟"إتغلبت وظبطتها مش عارفة جت ازاى بس جت" وخلاص
لازم أراجع قواعد اختيار مكان السفينة.

---

------------- Tasks from Dec 5, 2025 --------------
COMPLETE choose random directions for computer gameboard
COMPLETE filx human gameboard placement after submitting it wwith the computer gameboard

COMPLETE style computer ships responsively

---

---------- Tasks from Nov 27, 2025 --------------

COMPLETE Make the ui interacts with the backend to tell them with all updates from creating ships to updating there positions after the mouseDown event that happens to them
COMPLETE --- create data for ships and update ship index after positioning
COMPLETE +++ create data for gameboard to be responsible for all the updates of the ships and there positions and hits and sinks and that staff not just the ui gameboard there must be an object created from the data.js file

COMPLETE Check Rules can't read this.matrix or self.matrix because they are nested function.
NOTE1 => Solve this problem whether by being it not as nested or with any other way.
NOTE2 => Rerun the program to grasp the bug more.

? where the data will be saved? on the browser or on the machine or not save it at all

---

------------ Previous Tasks ---------------
// [ ] DEFINE reviveShips()
// NOTE: | keep the neighbouring rules, there must be at lest 1 cell between all cells from all sides
// [ ] | Store the ship's x and y position in your game data
// [ ] | Limit ship positioning only to the gameBoard
// [ ] | Apply placing conditions inside the gameBoard
// [x] | Add turning the ship vertically to horizontally and vice versa
// [x] | | Prevent rotating the ship when it's not in it's container
// [x] | ADD draging ships in the gameBord feature
// [x] | | complete rotating the ship properly and make rotation available from horizontal to vertical and vice versa; make the ship change it's direction in a beautiful way
// [x] | | define dragStart event listeners for gameBoard
// [x] | | modify eventListeners in reviveShips
// [x] | ADD (front, middle, back) classes to the gameBoard cells

// [x] | Make numbers in the gameBoard responsive
