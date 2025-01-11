use std::collections::VecDeque;
use std::collections::HashSet;
use std::fmt::Write as FmtWrite;
use std::fs::File;
use std::io::BufWriter;
use std::io::Write;
use lse_solver::*;



fn main() -> std::io::Result<()> {
    let mut algs = LseAlgs::new();
    for num in 0..360 {
        let state = State::create_eo_from_num(num);
        let solution = solution_to_string(solve(state.clone()));
        let alg = Algorithm {
            state,
            solution,
        };
        add_merge_dupes(alg, &mut algs);
    }

    let file = File::create("algs.json")?;
    let mut writer = BufWriter::new(file);
    serde_json::to_writer_pretty(&mut writer, &algs)?;
    writer.flush()?;
    Ok(())
}

fn solve(state: State) -> Vec<Move> {
    let mut q: VecDeque<Vec<Move>> = VecDeque::new();
    let visited: HashSet<State> = HashSet::new();

    q.push_back(Vec::new());
    while let Some(curr_moves) = q.pop_front() {
        let curr_state = state.apply_all(&curr_moves);
        if curr_state.is_solved() {
            return curr_moves;
        }
        if visited.contains(&curr_state) {
            continue;
        }

        match curr_moves.last() {
            Some(Move::M) | Some(Move::Mp) | Some(Move::Mt) => {
                q.push_back(curr_moves.with_push(Move::U));
                q.push_back(curr_moves.with_push(Move::Up));
                q.push_back(curr_moves.with_push(Move::Ut));
            },
            Some(Move::U) | Some(Move::Up) | Some(Move::Ut) => {
                q.push_back(curr_moves.with_push(Move::M));
                q.push_back(curr_moves.with_push(Move::Mp));
                q.push_back(curr_moves.with_push(Move::Mt));
            },
            None => {
                q.push_back(curr_moves.with_push(Move::M));
                q.push_back(curr_moves.with_push(Move::Mp));
                q.push_back(curr_moves.with_push(Move::Mt));
                q.push_back(curr_moves.with_push(Move::U));
                q.push_back(curr_moves.with_push(Move::Up));
                q.push_back(curr_moves.with_push(Move::Ut));
            },
        }
    }
    return Vec::new();
}

fn solution_to_string(moves: Vec<Move>) -> String {
    let mut s = String::new();

    for (i, m) in moves.iter().enumerate() {
        match m {
            Move::M => write!(s, "M").unwrap(),
            Move::Mp => write!(s, "M'").unwrap(),
            Move::Mt => write!(s, "M2").unwrap(),
            Move::U => write!(s, "U").unwrap(),
            Move::Up => write!(s, "U'").unwrap(),
            Move::Ut => write!(s, "U2").unwrap(),
        }
        if i != moves.len() - 1 {
            write!(s, " ").unwrap();
        }
    }
    s
}

fn add_merge_dupes(new_alg: Algorithm, algs: &mut LseAlgs) {
    let color_perm = new_alg.state.to_color_perm();
    let alg_set = if new_alg.state.is_d_solved() {
        &mut algs.d_solved
    } else if new_alg.state.is_d_swapped() {
        &mut algs.d_swapped
    } else if new_alg.state.is_one_d_solved() {
        &mut algs.one_d_solved
    } else if new_alg.state.is_one_d_swapped() {
        &mut algs.one_d_swapped
    } else if new_alg.state.is_d_edges_u_opposites() {
        &mut algs.d_edges_u_opposites
    } else {
        &mut algs.d_edges_u_adjacents
    };

    let mut dupe_type: Option<&mut Vec<Algorithm>> = None;
    for case in &mut *alg_set {
        let existing_color_perm = case.normal[0].state.to_color_perm();
        if existing_color_perm.is_duplicate(color_perm) {
            dupe_type = Some(&mut case.normal);
            break;
        } else if existing_color_perm.is_duplicate(color_perm.mirror_m()) {
            dupe_type = Some(&mut case.mirror_m);
            break;
        } else if existing_color_perm.is_duplicate(color_perm.mirror_s()) {
            dupe_type = Some(&mut case.mirror_s);
            break;
        } else if existing_color_perm.is_duplicate(color_perm.mirror_m().mirror_s()) {
            dupe_type = Some(&mut case.mirror_both);
            break;
        }
    }
    if let Some(d) = dupe_type {
        d.push(new_alg);
    } else {
        alg_set.push(AlgWithDupes::new_one_alg(new_alg));
    }
}
