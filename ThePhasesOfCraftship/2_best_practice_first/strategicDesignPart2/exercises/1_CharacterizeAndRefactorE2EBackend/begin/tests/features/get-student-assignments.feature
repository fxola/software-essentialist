Feature: Get all assignments for a student

    As a teacher
    I want to get all assignments for a student
    So that I can view a list of all assignments for the student

    Scenario: Successfully fetch all assignments
        Given a student that has been given assignments exists
        When I request all assignments for the student
        Then I should get a list of all assignments for the student

    Scenario: Fail to fetch assignments for a student that does not exist
        When I request all assignments for a non-existent student
        Then I should not get a list of assignments