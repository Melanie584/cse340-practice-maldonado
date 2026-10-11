import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

// Route handler for the faculty directory list page
const facultyListPage = (req, res) => {
    // Get the sort option from the query parameter
    // If there isn't one, sort by name
    const sortBy = req.query.sort || 'name';

    // Ask the model for the sorted faculty data
    const faculty = getSortedFaculty(sortBy);

    // Send the faculty data to the faculty list view
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: faculty,
        currentSort: sortBy
    });
};

// Route handler for an individual faculty detail page
const facultyDetailPage = (req, res, next) => {
    // Get the faculty ID from the route parameter
    const facultyId = req.params.facultyId;

    // Ask the model for the faculty member with that ID
    const facultyMember = getFacultyById(facultyId);

    // If the faculty member doesn't exist, create a 404 error
    if (!facultyMember) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    // Send the faculty member to the detail view
    res.render('faculty/detail', {
        title: facultyMember.name,
        faculty: facultyMember
    });
};

export { facultyListPage, facultyDetailPage };