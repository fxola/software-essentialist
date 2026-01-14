Feature: Assign assignment to student

    As a Teacher
    I want to assign an assignment to a student
    So that i can improve their learning outcomes 

    Scenario: Sucessfully assign an assignment to a student
        Given an enrolled student and an assignment exists
        When I want to assign an assignment to the student
        Then the assignment should be assigned to the student successfully

    Scenario: Fail to assign an assignment to a student when the student is not enrolled
        Given a student is not enrolled and an assignment exists
        When I want to assign an assignment to the student
        Then the assignment should not be assigned to the student

    Scenario: Fail to assign an assignment to a student when the assignment does not exist
        Given an enrolled student exists
        When I want to assign an assignment that does not exist to the enrolled student
        Then the assignment should not be assigned to the student

    Scenario: Fail to assign an assignment to a student when the assignment has already been assigned to the student
        Given an assignment has been assigned to an enrolled student
        When I want to assign the same assignment to the same student
        Then the assignment should not be assigned to the student
        
