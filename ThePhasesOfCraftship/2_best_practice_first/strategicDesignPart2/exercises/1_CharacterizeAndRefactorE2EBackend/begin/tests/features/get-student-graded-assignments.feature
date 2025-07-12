Feature: Get all graded assignments for a student

    As a teacher
    I want to get all graded assignments for a student
    So that I can view a list of all grades for the student

    Scenario: Successfully fetch all graded assignments
        Given a student whose assignments has been graded exists
        When I request all graded assignments for the student
        Then I should get a list of all grades for the student

    Scenario: Fail to fetch graded assignments for a student that does not exist
        When I request all graded assignments for a non-existent student
        Then I should not get a list of grades