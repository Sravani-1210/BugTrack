
package com.bugtrack.backend.controller;

import com.bugtrack.backend.entity.Bug;
import com.bugtrack.backend.service.BugService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/bugs")
@CrossOrigin(origins = "http://localhost:5173")
public class BugController {

    private final BugService bugService;

    public BugController(BugService bugService) {
        this.bugService = bugService;
    }

    @PostMapping
    public ResponseEntity<Bug> createBug(@RequestBody Bug bug) {
        Bug savedBug = bugService.createBug(bug);
        return new ResponseEntity<>(savedBug, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Bug>> getAllBugs() {
        return ResponseEntity.ok(bugService.getAllBugs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bug> getBugById(@PathVariable Long id) {
        return ResponseEntity.ok(bugService.getBugById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bug> updateBug(
            @PathVariable Long id,
            @RequestBody Bug bug) {
        return ResponseEntity.ok(bugService.updateBug(id, bug));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBug(@PathVariable Long id) {
        bugService.deleteBug(id);
        return ResponseEntity.noContent().build();
    }
}

