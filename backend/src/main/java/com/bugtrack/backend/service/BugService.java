
package com.bugtrack.backend.service;

import com.bugtrack.backend.entity.Bug;
import com.bugtrack.backend.repository.BugRepository;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BugService {

    private final BugRepository bugRepository;

    public BugService(BugRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    // Create Bug
    public Bug createBug(Bug bug) {
        return bugRepository.save(bug);
    }

    // Get All Bugs
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    // Get Bug By ID
    public Bug getBugById(Long id) {
        return bugRepository.findById(id)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Bug not found"
                    ));
    }

    // Update Bug
    public Bug updateBug(Long id, Bug updatedBug) {

        Bug existingBug = getBugById(id);

        existingBug.setTitle(updatedBug.getTitle());
        existingBug.setDescription(updatedBug.getDescription());
        existingBug.setPriority(updatedBug.getPriority());
        existingBug.setStatus(updatedBug.getStatus());
        existingBug.setReporter(updatedBug.getReporter());

        return bugRepository.save(existingBug);
    }

    // Delete Bug
    public void deleteBug(Long id) {

        Bug existingBug = getBugById(id);

        bugRepository.delete(existingBug);
    }
}

